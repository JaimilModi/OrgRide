import { prisma } from '../config/db.js';
import { AppError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';
import { VehicleStatus, VehicleType, FuelType } from '@prisma/client';

export interface CreateVehicleInput {
  vehicleNumber: string;
  type: VehicleType;
  brand: string;
  model: string;
  color: string;
  fuelType: FuelType;
  seatingCapacity: number;
  registrationYear: number;
  vehicleImage: string;
  rcNumber: string;
  rcImage: string;
  insuranceExpiry: Date;
  pollutionExpiry?: Date;
  isDefault?: boolean;
}

export interface UpdateVehicleInput {
  vehicleNumber?: string;
  type?: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  fuelType?: FuelType;
  seatingCapacity?: number;
  registrationYear?: number;
  vehicleImage?: string;
  rcNumber?: string;
  rcImage?: string;
  insuranceExpiry?: Date;
  pollutionExpiry?: Date;
  isDefault?: boolean;
  status?: VehicleStatus;
}

export class VehicleService {
  /**
   * Registers a new vehicle
   */
  static async createVehicle(ownerId: string, input: CreateVehicleInput) {
    const normalizedVehicleNo = input.vehicleNumber.toUpperCase().trim();
    const normalizedRcNo = input.rcNumber.trim();

    // Check vehicle number uniqueness
    const existingVehicleNo = await prisma.vehicle.findUnique({
      where: { vehicleNumber: normalizedVehicleNo }
    });
    if (existingVehicleNo) {
      throw new BadRequestError('Vehicle number is already registered');
    }

    // Check RC number uniqueness
    const existingRcNo = await prisma.vehicle.findUnique({
      where: { rcNumber: normalizedRcNo }
    });
    if (existingRcNo) {
      throw new BadRequestError('RC number is already registered');
    }

    // Check if this is the employee's first vehicle
    const vehicleCount = await prisma.vehicle.count({
      where: { ownerId }
    });

    const isFirstVehicle = vehicleCount === 0;
    const shouldBeDefault = isFirstVehicle ? true : !!input.isDefault;

    // Execute in a transaction if we need to unset other default vehicles
    if (shouldBeDefault) {
      return await prisma.$transaction(async (tx) => {
        // Clear default flag on existing vehicles of this owner
        await tx.vehicle.updateMany({
          where: { ownerId },
          data: { isDefault: false }
        });

        // Create new default vehicle
        return await tx.vehicle.create({
          data: {
            ...input,
            vehicleNumber: normalizedVehicleNo,
            rcNumber: normalizedRcNo,
            ownerId,
            isDefault: true
          }
        });
      });
    }

    return await prisma.vehicle.create({
      data: {
        ...input,
        vehicleNumber: normalizedVehicleNo,
        rcNumber: normalizedRcNo,
        ownerId,
        isDefault: false
      }
    });
  }

  /**
   * Lists all vehicles belonging to the owner
   */
  static async listVehicles(ownerId: string) {
    return await prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Fetches a vehicle by ID and validates ownership
   */
  static async getVehicleById(id: string, ownerId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', StatusCodes.NOT_FOUND);
    }

    if (vehicle.ownerId !== ownerId) {
      throw new ForbiddenError('Access Denied: You do not own this vehicle');
    }

    return vehicle;
  }

  /**
   * Updates vehicle details
   */
  static async updateVehicle(id: string, ownerId: string, input: UpdateVehicleInput) {
    // Assert ownership and existence
    const vehicle = await this.getVehicleById(id, ownerId);

    const dataToUpdate: any = { ...input };

    // Normalizations & checks if values are changing
    if (input.vehicleNumber) {
      const normalizedVehicleNo = input.vehicleNumber.toUpperCase().trim();
      if (normalizedVehicleNo !== vehicle.vehicleNumber) {
        const duplicateNo = await prisma.vehicle.findUnique({
          where: { vehicleNumber: normalizedVehicleNo }
        });
        if (duplicateNo) {
          throw new BadRequestError('Vehicle number is already registered');
        }
        dataToUpdate.vehicleNumber = normalizedVehicleNo;
      }
    }

    if (input.rcNumber) {
      const normalizedRcNo = input.rcNumber.trim();
      if (normalizedRcNo !== vehicle.rcNumber) {
        const duplicateRc = await prisma.vehicle.findUnique({
          where: { rcNumber: normalizedRcNo }
        });
        if (duplicateRc) {
          throw new BadRequestError('RC number is already registered');
        }
        dataToUpdate.rcNumber = normalizedRcNo;
      }
    }

    // Handle isDefault update transaction
    if (input.isDefault === true) {
      return await prisma.$transaction(async (tx) => {
        // Clear defaults
        await tx.vehicle.updateMany({
          where: { ownerId },
          data: { isDefault: false }
        });

        // Set target
        return await tx.vehicle.update({
          where: { id },
          data: { ...dataToUpdate, isDefault: true }
        });
      });
    }

    return await prisma.vehicle.update({
      where: { id },
      data: dataToUpdate
    });
  }

  /**
   * Performs soft delete by marking vehicle status as INACTIVE
   */
  static async softDeleteVehicle(id: string, ownerId: string) {
    const vehicle = await this.getVehicleById(id, ownerId);

    // FUTURE BUSINESS RULE NOTE:
    // "If a vehicle is assigned to an active ride, deletion should not be allowed.
    // This rule will be implemented during the Ride module."

    if (vehicle.isDefault) {
      return await prisma.$transaction(async (tx) => {
        // Soft delete the target
        const updated = await tx.vehicle.update({
          where: { id },
          data: { status: VehicleStatus.INACTIVE, isDefault: false }
        });

        // Check if employee has another ACTIVE vehicle to promote to default
        const anotherActiveVehicle = await tx.vehicle.findFirst({
          where: {
            ownerId,
            status: VehicleStatus.ACTIVE,
            NOT: { id }
          }
        });

        if (anotherActiveVehicle) {
          await tx.vehicle.update({
            where: { id: anotherActiveVehicle.id },
            data: { isDefault: true }
          });
        }

        return updated;
      });
    }

    return await prisma.vehicle.update({
      where: { id },
      data: { status: VehicleStatus.INACTIVE }
    });
  }
}
