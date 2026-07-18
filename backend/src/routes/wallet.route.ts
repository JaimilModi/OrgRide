import { Router } from 'express';
import {
  getWallet,
  getTransactionHistory,
  createRechargeSession,
  confirmRecharge,
  payForBooking
} from '../controllers/wallet.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import {
  RechargeWalletSchema,
  ConfirmRechargeSchema,
  PayBookingSchema
} from '../validations/wallet.validation.js';

const router = Router();

// All wallet routes require JWT authentication
router.use(authenticateJWT);

router.get('/', getWallet);
router.get('/history', getTransactionHistory);
router.post('/recharge', validateRequest(RechargeWalletSchema), createRechargeSession);
router.post('/recharge/confirm', validateRequest(ConfirmRechargeSchema), confirmRecharge);
router.post('/pay', validateRequest(PayBookingSchema), payForBooking);

export default router;
