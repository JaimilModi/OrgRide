import { z } from 'zod';

export const RechargeWalletSchema = z.object({
  body: z.object({
    amount: z.number({
      required_error: 'Recharge amount is required'
    }).positive('Amount must be greater than zero'),
    redirectUrl: z.string({
      required_error: 'Redirect URL is required'
    }).url('Redirect URL must be a valid URL')
  })
});

export const ConfirmRechargeSchema = z.object({
  body: z.object({
    sessionId: z.string({
      required_error: 'Session ID is required'
    }).min(1, 'Session ID cannot be empty')
  })
});

export const PayBookingSchema = z.object({
  body: z.object({
    bookingId: z.string({
      required_error: 'Booking ID is required'
    }).uuid('Booking ID must be a valid UUID')
  })
});
