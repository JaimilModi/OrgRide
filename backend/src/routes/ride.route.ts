import { Router } from 'express';
import {
  createRide,
  listRides,
  getRide,
  updateRide,
  deleteRide,
  searchRides,
  getPublicRide,
  startRide,
  completeRide
} from '../controllers/ride.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import {
  CreateRideSchema,
  UpdateRideSchema,
  SearchRidesSchema,
  RideIdParamSchema
} from '../validations/ride.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// All ride endpoints require authentication
router.use(authenticateJWT);

router.get('/', listRides);
router.get('/search', validateRequest(SearchRidesSchema), searchRides);
router.get('/public/:id', validateRequest(RideIdParamSchema), getPublicRide);
router.get('/:id', validateRequest(RideIdParamSchema), getRide);
router.post('/', validateRequest(CreateRideSchema), createRide);
router.put('/:id', validateRequest(RideIdParamSchema), validateRequest(UpdateRideSchema), updateRide);
router.delete('/:id', validateRequest(RideIdParamSchema), deleteRide);
router.post('/:id/start', validateRequest(RideIdParamSchema), startRide);
router.post('/:id/complete', validateRequest(RideIdParamSchema), completeRide);

export default router;

