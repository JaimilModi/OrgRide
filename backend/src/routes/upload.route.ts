import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { uploadSingleImage } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/', authenticateJWT, uploadSingleImage, uploadFile);

export default router;
