import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    orgId: string;
    isFirstLogin: boolean;
  };
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Fetch user from DB to verify status matches
    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id }
    });

    if (!employee) {
      throw new UnauthorizedError('Employee not found');
    }

    if (employee.status === 'INACTIVE') {
      throw new ForbiddenError('Your account is inactive. Access denied.');
    }

    if (employee.status === 'SUSPENDED') {
      throw new ForbiddenError('Your account is suspended. Access denied.');
    }

    // Attach claims to the request object
    req.user = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      orgId: employee.orgId,
      isFirstLogin: employee.isFirstLogin
    };

    next();
  } catch (error) {
    next(error);
  }
};
