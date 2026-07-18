import { z } from 'zod';

export const CreateBookingSchema = z.object({
  body: z.object({
    rideId: z.string({
      required_error: 'Ride ID is required'
    }).uuid('Ride ID must be a valid UUID'),
    seatsBooked: z.number({
      required_error: 'Seats booked is required'
    }).int().positive('Seats booked must be at least 1')
  })
});

export const BookingIdParamSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Booking ID is required'
    }).uuid('Booking ID must be a valid UUID')
  })
});
