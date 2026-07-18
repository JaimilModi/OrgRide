import { Router } from 'express';
import {
  createBooking,
  listPassengerBookings,
  listDriverRequests,
  getBooking,
  acceptBooking,
  rejectBooking,
  cancelBooking
} from '../controllers/booking.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { CreateBookingSchema, BookingIdParamSchema } from '../validations/booking.validation.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// All booking routes require authentication
router.use(authenticateJWT);

router.post('/', validateRequest(CreateBookingSchema), createBooking);
router.get('/me', listPassengerBookings);
router.get('/requests', listDriverRequests);
router.get('/:id', validateRequest(BookingIdParamSchema), getBooking);
router.patch('/:id/accept', validateRequest(BookingIdParamSchema), acceptBooking);
router.patch('/:id/reject', validateRequest(BookingIdParamSchema), rejectBooking);
router.patch('/:id/cancel', validateRequest(BookingIdParamSchema), cancelBooking);

export default router;
