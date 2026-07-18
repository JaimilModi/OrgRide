import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/db.js';

export const checkHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let dbStatus = 'unhealthy';
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'healthy';
    } catch (dbError) {
      console.error('Database connection failed during health check:', dbError);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        server: 'healthy',
        database: dbStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
