import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RideService } from '../services/ride.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createRide = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const ride = await RideService.createRide(driverId, req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Ride offered successfully',
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const listRides = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const rides = await RideService.listRides(driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

export const getRide = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const ride = await RideService.getRideById(req.params.id, driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const updateRide = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const ride = await RideService.updateRide(req.params.id, driverId, req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Ride updated successfully',
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRide = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driverId = req.user!.id;
    const ride = await RideService.cancelRide(req.params.id, driverId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: {
        id: ride.id,
        status: ride.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const searchRides = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const result = await RideService.searchRides(req.query, currentUserId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.rides,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicRide = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const ride = await RideService.getPublicRideById(req.params.id, currentUserId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

