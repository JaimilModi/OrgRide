import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VehicleService } from '../services/vehicle.service.js';

export const listVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = (req as any).user.id;
    const vehicles = await VehicleService.listVehicles(ownerId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = (req as any).user.id;
    const { id } = req.params;
    const vehicle = await VehicleService.getVehicleById(id, ownerId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = (req as any).user.id;
    const newVehicle = await VehicleService.createVehicle(ownerId, req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Vehicle registered successfully',
      data: newVehicle
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = (req as any).user.id;
    const { id } = req.params;

    const updatedVehicle = await VehicleService.updateVehicle(id, ownerId, req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ownerId = (req as any).user.id;
    const { id } = req.params;

    const softDeleted = await VehicleService.softDeleteVehicle(id, ownerId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Vehicle deleted successfully (marked inactive)',
      data: softDeleted
    });
  } catch (error) {
    next(error);
  }
};
