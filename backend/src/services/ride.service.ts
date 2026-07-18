import { prisma } from '../config/db.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { Decimal } from '@prisma/client/runtime/library';

export class RideService {
  /**
   * Helper to generate human-readable unique ride identifier: ORG-YYYYMMDD-XXXX
   */
  private static async generateRideCode(): Promise<string> {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const startOfDay = new Date(Date.UTC(year, now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const count = await prisma.ride.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    const sequentialNumber = String(count + 1).padStart(4, '0');
    return `ORG-${dateStr}-${sequentialNumber}`;
  }

  /**
   * Create a new ride
   */
  static async createRide(driverId: string, data: any) {
    // 1. Combine pickupDate and pickupTime
    const pickupAt = new Date(`${data.pickupDate}T${data.pickupTime}Z`);
    if (isNaN(pickupAt.getTime())) {
      throw new BadRequestError('Invalid pickup date or time format');
    }

    // 2. Validate pickup date-time is in the future in UTC
    if (pickupAt.getTime() <= Date.now()) {
      throw new BadRequestError('Pickup date/time must be in the future');
    }

    // 3. Price per seat must be greater than zero
    const price = Number(data.pricePerSeat);
    if (isNaN(price) || price <= 0) {
      throw new BadRequestError('Price per seat must be greater than zero');
    }

    // 4. Verify vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId }
    });

    if (!vehicle) {
      throw new BadRequestError('Vehicle not found');
    }

    // Selected vehicle must belong to authenticated employee
    if (vehicle.ownerId !== driverId) {
      throw new ForbiddenError('You do not own this vehicle');
    }

    // Vehicle status must be ACTIVE
    if (vehicle.status !== 'ACTIVE') {
      throw new BadRequestError('Selected vehicle is inactive');
    }

    // Vehicle verificationStatus must be VERIFIED
    if (vehicle.verificationStatus !== 'VERIFIED') {
      throw new BadRequestError('Selected vehicle is not verified');
    }

    // 5. Seating capacity check
    const seats = parseInt(data.availableSeats, 10);
    if (isNaN(seats) || seats <= 0) {
      throw new BadRequestError('Available seats must be greater than zero');
    }
    if (seats > vehicle.seatingCapacity) {
      throw new BadRequestError(`Available seats cannot exceed vehicle seating capacity (${vehicle.seatingCapacity})`);
    }

    // 6. Check driver account status is active
    const employee = await prisma.employee.findUnique({
      where: { id: driverId }
    });
    if (!employee || employee.status !== 'ACTIVE') {
      throw new ForbiddenError('Only active employees can create rides');
    }

    // 7. Generate unique rideCode
    const rideCode = await this.generateRideCode();

    // 8. Save ride record
    return prisma.ride.create({
      data: {
        driverId,
        vehicleId: data.vehicleId,
        rideCode,
        sourceAddress: data.sourceAddress,
        sourceLatitude: new Decimal(data.sourceLatitude),
        sourceLongitude: new Decimal(data.sourceLongitude),
        destinationAddress: data.destinationAddress,
        destinationLatitude: new Decimal(data.destinationLatitude),
        destinationLongitude: new Decimal(data.destinationLongitude),
        pickupAt,
        pricePerSeat: new Decimal(price),
        availableSeats: seats,
        notes: data.notes || null,
        femaleOnly: data.femaleOnly ?? false,
        status: 'SCHEDULED'
      },
      include: {
        vehicle: true
      }
    });
  }

  /**
   * List rides for the driver
   */
  static async listRides(driverId: string) {
    return prisma.ride.findMany({
      where: { driverId },
      include: {
        vehicle: true
      },
      orderBy: {
        pickupAt: 'asc'
      }
    });
  }

  /**
   * Get ride details
   */
  static async getRideById(id: string, driverId: string) {
    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        vehicle: true
      }
    });

    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    // Access control: driver can view own rides
    if (ride.driverId !== driverId) {
      throw new ForbiddenError('Access Denied: You do not own this ride');
    }

    return ride;
  }

  /**
   * Update ride details (only SCHEDULED rides)
   */
  static async updateRide(id: string, driverId: string, data: any) {
    const ride = await prisma.ride.findUnique({
      where: { id },
      include: { vehicle: true }
    });

    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    if (ride.driverId !== driverId) {
      throw new ForbiddenError('You are not authorized to edit this ride');
    }

    // Drivers may edit only SCHEDULED rides
    if (ride.status !== 'SCHEDULED') {
      throw new BadRequestError(`Cannot edit a ride that is already ${ride.status}`);
    }

    const updateData: any = {};

    // Validate and combine pickup date/time if provided
    if (data.pickupDate || data.pickupTime) {
      const pDate = data.pickupDate || ride.pickupAt.toISOString().split('T')[0];
      const pTime = data.pickupTime || ride.pickupAt.toISOString().split('T')[1].slice(0, 5);
      const pickupAt = new Date(`${pDate}T${pTime}Z`);
      if (isNaN(pickupAt.getTime())) {
        throw new BadRequestError('Invalid pickup date or time format');
      }
      if (pickupAt.getTime() <= Date.now()) {
        throw new BadRequestError('Pickup date/time must be in the future');
      }
      updateData.pickupAt = pickupAt;
    }

    if (data.pricePerSeat !== undefined) {
      const price = Number(data.pricePerSeat);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestError('Price per seat must be greater than zero');
      }
      updateData.pricePerSeat = new Decimal(price);
    }

    // Get active vehicle context to validate seats
    let activeVehicle = ride.vehicle;
    if (data.vehicleId && data.vehicleId !== ride.vehicleId) {
      const newVehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId }
      });
      if (!newVehicle) {
        throw new BadRequestError('Vehicle not found');
      }
      if (newVehicle.ownerId !== driverId) {
        throw new ForbiddenError('You do not own this vehicle');
      }
      if (newVehicle.status !== 'ACTIVE') {
        throw new BadRequestError('Selected vehicle is inactive');
      }
      if (newVehicle.verificationStatus !== 'VERIFIED') {
        throw new BadRequestError('Selected vehicle is not verified');
      }
      activeVehicle = newVehicle;
      updateData.vehicleId = data.vehicleId;
    }

    if (data.availableSeats !== undefined) {
      const seats = parseInt(data.availableSeats, 10);
      if (isNaN(seats) || seats <= 0) {
        throw new BadRequestError('Available seats must be greater than zero');
      }
      if (seats > activeVehicle.seatingCapacity) {
        throw new BadRequestError(`Available seats cannot exceed vehicle seating capacity (${activeVehicle.seatingCapacity})`);
      }
      updateData.availableSeats = seats;
    } else if (data.vehicleId && data.vehicleId !== ride.vehicleId) {
      // Vehicle changed, verify existing seats fits in new vehicle capacity
      if (ride.availableSeats > activeVehicle.seatingCapacity) {
        throw new BadRequestError(`Existing available seats (${ride.availableSeats}) exceeds new vehicle capacity (${activeVehicle.seatingCapacity})`);
      }
    }

    if (data.sourceAddress !== undefined) updateData.sourceAddress = data.sourceAddress;
    if (data.sourceLatitude !== undefined) updateData.sourceLatitude = new Decimal(data.sourceLatitude);
    if (data.sourceLongitude !== undefined) updateData.sourceLongitude = new Decimal(data.sourceLongitude);
    if (data.destinationAddress !== undefined) updateData.destinationAddress = data.destinationAddress;
    if (data.destinationLatitude !== undefined) updateData.destinationLatitude = new Decimal(data.destinationLatitude);
    if (data.destinationLongitude !== undefined) updateData.destinationLongitude = new Decimal(data.destinationLongitude);
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.femaleOnly !== undefined) updateData.femaleOnly = data.femaleOnly;

    return prisma.ride.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: true
      }
    });
  }

  /**
   * Cancel a ride (soft delete)
   */
  static async cancelRide(id: string, driverId: string) {
    const ride = await prisma.ride.findUnique({
      where: { id }
    });

    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    if (ride.driverId !== driverId) {
      throw new ForbiddenError('You are not authorized to cancel this ride');
    }

    // Drivers may cancel only SCHEDULED rides
    if (ride.status !== 'SCHEDULED') {
      throw new BadRequestError(`Cannot cancel a ride that is already ${ride.status}`);
    }

    return prisma.ride.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    });
  }
}
