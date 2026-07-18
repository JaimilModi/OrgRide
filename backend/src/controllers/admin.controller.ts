import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AdminService } from '../services/admin.service.js';
import { VerificationStatus, AccountStatus } from '@prisma/client';

export const getSystemStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await AdminService.getSystemStats();
    res.status(StatusCodes.OK).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const listVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicles = await AdminService.getVehicles();
    res.status(StatusCodes.OK).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
};

export const updateVehicleVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(VerificationStatus).includes(status)) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: { message: 'Invalid status' } });
      return;
    }

    const updatedVehicle = await AdminService.updateVehicleVerification(id, status as VerificationStatus);
    res.status(StatusCodes.OK).json({ success: true, data: updatedVehicle });
  } catch (error) {
    next(error);
  }
};

export const listEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employees = await AdminService.getEmployees();
    res.status(StatusCodes.OK).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(AccountStatus).includes(status)) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: { message: 'Invalid status' } });
      return;
    }

    const updatedEmployee = await AdminService.updateEmployeeStatus(id, status as AccountStatus);
    res.status(StatusCodes.OK).json({ success: true, data: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

export const listRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rides = await AdminService.getRides();
    res.status(StatusCodes.OK).json({ success: true, data: rides });
  } catch (error) {
    next(error);
  }
};

export const listBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await AdminService.getBookings();
    res.status(StatusCodes.OK).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
