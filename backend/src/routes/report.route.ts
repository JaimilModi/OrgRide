import { Router, Response, NextFunction } from 'express';
import {
  createReport,
  listReports,
  getReport,
  updateReportStatus
} from '../controllers/report.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  CreateReportSchema,
  ReportIdParamSchema,
  UpdateReportStatusSchema
} from '../validations/report.validation.js';

const router = Router();

// Require authentication for all report operations
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

router.post('/', validateRequest(CreateReportSchema), createReport);
router.get('/', listReports);
router.get('/:id', validateRequest(ReportIdParamSchema), getReport);
router.patch('/:id/status', requireAdmin, validateRequest(ReportIdParamSchema), validateRequest(UpdateReportStatusSchema), updateReportStatus);

export default router;
