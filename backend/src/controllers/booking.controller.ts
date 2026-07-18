import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BookingService } from '../services/booking.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user!.id;
    const { rideId, seatsBooked } = req.body;
    const booking = await BookingService.createBooking(passengerId, rideId, seatsBooked);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Booking request created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const listPassengerBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user!.id;
    const bookings = await BookingService.getPassengerBookings(passengerId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const listDriverRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const requests = await BookingService.getDriverRequests(driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const booking = await BookingService.getBookingById(req.params.id, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const acceptBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const booking = await BookingService.acceptBooking(req.params.id, driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Booking request accepted successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const rejectBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const booking = await BookingService.rejectBooking(req.params.id, driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Booking request rejected successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user!.id;
    const booking = await BookingService.cancelBooking(req.params.id, passengerId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
