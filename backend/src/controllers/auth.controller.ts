import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service.js';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { loginId, password } = req.body;
    const result = await AuthService.login(loginId, password);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.user is set by the auth middleware
    const employeeId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    await AuthService.changePassword(employeeId, oldPassword, newPassword);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
