import { z } from 'zod';

export const CreateReportSchema = z.object({
  body: z.object({
    rideId: z.string({
      required_error: 'Ride ID is required'
    }).uuid('Ride ID must be a valid UUID'),
    reportedUserId: z.string({
      required_error: 'Reported user ID is required'
    }).uuid('Reported user ID must be a valid UUID'),
    category: z.enum(['DRIVER_LATE', 'PASSENGER_LATE', 'VEHICLE', 'PAYMENT', 'SAFETY', 'OTHER'], {
      errorMap: () => ({ message: 'Invalid category' })
    }),
    description: z.string({
      required_error: 'Description is required'
    }).min(5, 'Description must be at least 5 characters long')
  })
});

export const ReportIdParamSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Report ID is required'
    }).uuid('Report ID must be a valid UUID')
  })
});

export const UpdateReportStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'REVIEWING', 'RESOLVED'], {
      errorMap: () => ({ message: 'Invalid status' })
    })
  })
});
