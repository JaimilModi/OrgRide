import { prisma } from '../config/db.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';

export class BookingService {
  /**
   * Request a new ride booking (Passenger)
   */
  static async createBooking(passengerId: string, rideId: string, seatsBooked: number) {
    if (seatsBooked <= 0) {
      throw new BadRequestError('Seats booked must be greater than zero');
    }

    // 1. Fetch Passenger details
    const passenger = await prisma.employee.findUnique({
      where: { id: passengerId }
    });
    if (!passenger) {
      throw new NotFoundError('Passenger not found');
    }

    // 2. Fetch Ride details with driver and vehicle info
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        driver: true,
        vehicle: true
      }
    });

    if (!ride) {
      throw new NotFoundError('Ride not found');
    }

    // 3. Validation checks
    if (ride.status !== 'SCHEDULED') {
      throw new BadRequestError(`Cannot book a ride that is already ${ride.status}`);
    }

    if (ride.pickupAt.getTime() <= Date.now()) {
      throw new BadRequestError('Cannot book a past ride');
    }

    if (ride.driverId === passengerId) {
      throw new BadRequestError('You cannot book your own ride');
    }

    if (ride.vehicle.status !== 'ACTIVE') {
      throw new BadRequestError('Vehicle is inactive');
    }

    if (ride.vehicle.verificationStatus !== 'VERIFIED') {
      throw new BadRequestError('Vehicle is not verified');
    }

    const remainingSeats = ride.availableSeats - ride.bookedSeats;
    if (seatsBooked > remainingSeats) {
      throw new BadRequestError(`Cannot book ${seatsBooked} seats. Only ${remainingSeats} seats remaining.`);
    }

    // 4. Duplicate booking check (exclude CANCELLED and REJECTED)
    const existingActiveBooking = await prisma.rideParticipant.findFirst({
      where: {
        rideId,
        passengerId,
        status: {
          in: ['PENDING', 'ACCEPTED']
        }
      }
    });

    if (existingActiveBooking) {
      throw new BadRequestError('You already have an active booking request for this ride');
    }

    // 5. Create booking request (PENDING status)
    return prisma.rideParticipant.create({
      data: {
        rideId,
        passengerId,
        seatsBooked,
        status: 'PENDING'
      },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                name: true,
                languagePreference: true
              }
            },
            vehicle: {
              select: {
                brand: true,
                model: true,
                type: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * View passenger's own bookings
   */
  static async getPassengerBookings(passengerId: string) {
    return prisma.rideParticipant.findMany({
      where: { passengerId },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                name: true,
                languagePreference: true
              }
            },
            vehicle: {
              select: {
                brand: true,
                model: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * View driver's incoming booking requests
   */
  static async getDriverRequests(driverId: string) {
    return prisma.rideParticipant.findMany({
      where: {
        ride: {
          driverId
        }
      },
      include: {
        passenger: {
          select: {
            name: true,
            email: true,
            phone: true,
            department: true
          }
        },
        ride: {
          include: {
            vehicle: {
              select: {
                brand: true,
                model: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get booking details by ID
   */
  static async getBookingById(id: string, userId: string) {
    const booking = await prisma.rideParticipant.findUnique({
      where: { id },
      include: {
        passenger: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true
              }
            },
            vehicle: {
              select: {
                brand: true,
                model: true,
                type: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.passengerId !== userId && booking.ride.driverId !== userId) {
      throw new ForbiddenError('You are not authorized to view this booking');
    }

    return booking;
  }

  /**
   * Accept booking request (Driver)
   */
  static async acceptBooking(id: string, driverId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch booking inside transaction to lock
      const booking = await tx.rideParticipant.findUnique({
        where: { id },
        include: {
          ride: {
            include: {
              vehicle: true
            }
          }
        }
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // 2. Authorization
      if (booking.ride.driverId !== driverId) {
        throw new ForbiddenError('You are not authorized to accept bookings for this ride');
      }

      // 3. Status checks
      if (booking.status !== 'PENDING') {
        throw new BadRequestError(`Cannot accept a booking with status ${booking.status}`);
      }

      if (booking.ride.status !== 'SCHEDULED') {
        throw new BadRequestError(`Cannot accept booking because the ride is already ${booking.ride.status}`);
      }

      // 4. Seating checks
      const remainingSeats = booking.ride.availableSeats - booking.ride.bookedSeats;
      if (booking.seatsBooked > remainingSeats) {
        throw new BadRequestError(`Not enough seats remaining to accept this booking. Remaining: ${remainingSeats}, Requested: ${booking.seatsBooked}`);
      }

      // 5. Commit state updates
      const updatedBooking = await tx.rideParticipant.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      });

      await tx.ride.update({
        where: { id: booking.rideId },
        data: {
          bookedSeats: {
            increment: booking.seatsBooked
          }
        }
      });

      return updatedBooking;
    });
  }

  /**
   * Reject booking request (Driver)
   */
  static async rejectBooking(id: string, driverId: string) {
    const booking = await prisma.rideParticipant.findUnique({
      where: { id },
      include: {
        ride: true
      }
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.ride.driverId !== driverId) {
      throw new ForbiddenError('You are not authorized to reject bookings for this ride');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestError(`Cannot reject a booking with status ${booking.status}`);
    }

    if (booking.ride.status !== 'SCHEDULED') {
      throw new BadRequestError('Cannot reject booking because the ride is not SCHEDULED');
    }

    return prisma.rideParticipant.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
  }

  /**
   * Cancel booking (Passenger)
   */
  static async cancelBooking(id: string, passengerId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch booking inside transaction
      const booking = await tx.rideParticipant.findUnique({
        where: { id },
        include: {
          ride: true
        }
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // 2. Authorization
      if (booking.passengerId !== passengerId) {
        throw new ForbiddenError('You are not authorized to cancel this booking');
      }

      // 3. Status checks
      if (booking.status !== 'PENDING' && booking.status !== 'ACCEPTED') {
        throw new BadRequestError(`Cannot cancel a booking with status ${booking.status}`);
      }

      if (booking.ride.status !== 'SCHEDULED') {
        throw new BadRequestError('Cannot cancel booking because the ride is not SCHEDULED');
      }

      // 4. Update status and release seats if it was previously ACCEPTED
      const updatedBooking = await tx.rideParticipant.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      if (booking.status === 'ACCEPTED') {
        await tx.ride.update({
          where: { id: booking.rideId },
          data: {
            bookedSeats: {
              decrement: booking.seatsBooked
            }
          }
        });
      }

      return updatedBooking;
    });
  }
}
