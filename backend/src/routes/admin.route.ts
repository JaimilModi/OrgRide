import { Router, Response, NextFunction } from 'express';
import {
  getSystemStats,
  listVehicles,
  updateVehicleVerification,
  listEmployees,
  updateEmployeeStatus,
  listRides,
  listBookings
} from '../controllers/admin.controller.js';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware
router.use(authenticateJWT);

// Admin-only role check middleware
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access Denied: Administrator role required'
      }
    });
    return;
  }
  next();
};

router.use(requireAdmin);

// Analytics
router.get('/stats', getSystemStats);

// Vehicles
router.get('/vehicles', listVehicles);
router.patch('/vehicles/:id/verify', updateVehicleVerification);

// Employees
router.get('/employees', listEmployees);
router.patch('/employees/:id/status', updateEmployeeStatus);

// Rides & Bookings
router.get('/rides', listRides);
router.get('/bookings', listBookings);

export default router;
