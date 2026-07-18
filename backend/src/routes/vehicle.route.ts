import { Router } from 'express';
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicle.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { CreateVehicleSchema, UpdateVehicleSchema } from '../validations/vehicle.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Apply auth middleware to all vehicle routes
router.use(authenticateJWT);

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', validateRequest(CreateVehicleSchema), createVehicle);
router.put('/:id', validateRequest(UpdateVehicleSchema), updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
