import { z } from 'zod';

const LatitudeSchema = z.number({
  required_error: 'Latitude is required'
}).min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90');

const LongitudeSchema = z.number({
  required_error: 'Longitude is required'
}).min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180');

export const CreateRideSchema = z.object({
  body: z.object({
    vehicleId: z.string({
      required_error: 'Vehicle ID is required'
    }).min(1, 'Vehicle ID cannot be empty'),
    sourceAddress: z.string({
      required_error: 'Source address is required'
    }).min(1, 'Source address cannot be empty'),
    sourceLatitude: LatitudeSchema,
    sourceLongitude: LongitudeSchema,
    destinationAddress: z.string({
      required_error: 'Destination address is required'
    }).min(1, 'Destination address cannot be empty'),
    destinationLatitude: LatitudeSchema,
    destinationLongitude: LongitudeSchema,
    pickupDate: z.string({
      required_error: 'Pickup date is required'
    }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Pickup date must be in YYYY-MM-DD format'),
    pickupTime: z.string({
      required_error: 'Pickup time is required'
    }).regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Pickup time must be in HH:MM or HH:MM:SS format'),
    pricePerSeat: z.number({
      required_error: 'Price per seat is required'
    }).positive('Price per seat must be greater than zero'),
    availableSeats: z.number({
      required_error: 'Available seats is required'
    }).int().positive('Available seats must be at least 1'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
    femaleOnly: z.boolean().optional()
  })
});

export const UpdateRideSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID cannot be empty').optional(),
    sourceAddress: z.string().min(1, 'Source address cannot be empty').optional(),
    sourceLatitude: LatitudeSchema.optional(),
    sourceLongitude: LongitudeSchema.optional(),
    destinationAddress: z.string().min(1, 'Destination address cannot be empty').optional(),
    destinationLatitude: LatitudeSchema.optional(),
    destinationLongitude: LongitudeSchema.optional(),
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pickup date must be in YYYY-MM-DD format').optional(),
    pickupTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Pickup time must be in HH:MM or HH:MM:SS format').optional(),
    pricePerSeat: z.number().positive('Price per seat must be greater than zero').optional(),
    availableSeats: z.number().int().positive('Available seats must be at least 1').optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
    femaleOnly: z.boolean().optional()
  })
});
