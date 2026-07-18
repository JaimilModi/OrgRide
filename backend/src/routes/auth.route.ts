import { Router } from 'express';
import { login, register, changePassword } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { LoginSchema, RegisterSchema, ChangePasswordSchema } from '../validations/auth.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(RegisterSchema), register);
router.post('/login', validateRequest(LoginSchema), login);
router.post('/change-password', authenticateJWT, validateRequest(ChangePasswordSchema), changePassword);

export default router;
