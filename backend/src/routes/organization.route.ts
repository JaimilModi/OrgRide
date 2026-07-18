import { Router } from 'express';
import { getOrganization, updateOrganization } from '../controllers/organization.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { UpdateOrganizationSchema } from '../validations/profile.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateJWT, getOrganization);
router.put('/', authenticateJWT, validateRequest(UpdateOrganizationSchema), updateOrganization);

export default router;
