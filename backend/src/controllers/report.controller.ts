import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReportService } from '../services/report.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const createReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reporterId = req.user!.id;
    const report = await ReportService.createReport(reporterId, req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Report filed successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const listReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const reports = await ReportService.getReports(userId, role);

    res.status(StatusCodes.OK).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const report = await ReportService.getReportById(req.params.id, userId, role);

    res.status(StatusCodes.OK).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;
    const report = await ReportService.updateReportStatus(req.params.id, status);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Report status updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};
