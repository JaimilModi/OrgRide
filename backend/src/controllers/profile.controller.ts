import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProfileService } from '../services/profile.service.js';

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = (req as any).user.id;
    const profile = await ProfileService.getProfile(employeeId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = (req as any).user.id;
    
    // We only unpack allowed properties from body
    const {
      name,
      phone,
      gender,
      languagePreference,
      avatarUrl,
      address,
      emergencyContact,
      department,
      designation,
      workShift,
      profilePhoto
    } = req.body;

    const updatedProfile = await ProfileService.updateProfile(employeeId, {
      name,
      phone,
      gender,
      languagePreference,
      avatarUrl,
      address,
      emergencyContact,
      department,
      designation,
      workShift,
      profilePhoto
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};
