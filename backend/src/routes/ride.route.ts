import { Router } from 'express';
import {
  createRide,
  listRides,
  getRide,
  updateRide,
  deleteRide,
  searchRides,
  getPublicRide
} from '../controllers/ride.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { CreateRideSchema, UpdateRideSchema, SearchRidesSchema } from '../validations/ride.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// All ride endpoints require authentication
router.use(authenticateJWT);

router.get('/', listRides);
router.get('/search', validateRequest(SearchRidesSchema), searchRides);
router.get('/public/:id', getPublicRide);
router.get('/:id', getRide);
router.post('/', validateRequest(CreateRideSchema), createRide);
router.put('/:id', validateRequest(UpdateRideSchema), updateRide);
router.delete('/:id', deleteRide);

export default router;

