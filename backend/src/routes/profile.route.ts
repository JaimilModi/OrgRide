import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { UpdateProfileSchema } from '../validations/profile.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getProfile);
router.put('/', authenticateJWT, validateRequest(UpdateProfileSchema), updateProfile);

export default router;
