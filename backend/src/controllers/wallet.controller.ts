import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WalletService } from '../services/wallet.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.user!.id;
    const wallet = await WalletService.getWallet(employeeId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.user!.id;
    const history = await WalletService.getTransactionHistory(employeeId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const createRechargeSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.user!.id;
    const { amount, redirectUrl } = req.body;

    const sessionData = await WalletService.createRechargeSession(employeeId, Number(amount), redirectUrl);

    res.status(StatusCodes.OK).json({
      success: true,
      data: sessionData,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmRecharge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId = req.user!.id;
    const { sessionId } = req.body;

    const wallet = await WalletService.confirmRecharge(employeeId, sessionId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Wallet recharged successfully',
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

export const payForBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user!.id;
    const { bookingId } = req.body;

    const paymentResult = await WalletService.payForBooking(passengerId, bookingId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Booking paid successfully',
      data: paymentResult,
    });
  } catch (error) {
    next(error);
  }
};
