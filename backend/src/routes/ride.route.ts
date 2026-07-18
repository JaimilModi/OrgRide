import { Router } from 'express';
import {
  createRide,
  listRides,
  getRide,
  updateRide,
  deleteRide
} from '../controllers/ride.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { CreateRideSchema, UpdateRideSchema } from '../validations/ride.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// All ride endpoints require authentication
router.use(authenticateJWT);

router.get('/', listRides);
router.get('/:id', getRide);
router.post('/', validateRequest(CreateRideSchema), createRide);
router.put('/:id', validateRequest(UpdateRideSchema), updateRide);
router.delete('/:id', deleteRide);

export default router;
