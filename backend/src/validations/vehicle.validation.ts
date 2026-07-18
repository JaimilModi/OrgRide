import { z } from 'zod';

const VehicleTypeSchema = z.enum(['HATCHBACK', 'SEDAN', 'SUV', 'BIKE', 'OTHER']);
const FuelTypeSchema = z.enum(['PETROL', 'DIESEL', 'CNG', 'EV', 'HYBRID']);
const VehicleStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE']);

export const CreateVehicleSchema = z.object({
  body: z.object({
    vehicleNumber: z.string({
      required_error: 'Vehicle number is required'
    }).min(1, 'Vehicle number cannot be empty'),
    type: VehicleTypeSchema,
    brand: z.string({
      required_error: 'Brand is required'
    }).min(1, 'Brand cannot be empty'),
    model: z.string({
      required_error: 'Model is required'
    }).min(1, 'Model cannot be empty'),
    color: z.string({
      required_error: 'Color is required'
    }).min(1, 'Color cannot be empty'),
    fuelType: FuelTypeSchema,
    seatingCapacity: z.number({
      required_error: 'Seating capacity is required'
    }).int().min(1, 'Seating capacity must be at least 1').max(8, 'Seating capacity cannot exceed 8'),
    registrationYear: z.number({
      required_error: 'Registration year is required'
    }).int(),
    vehicleImage: z.string({
      required_error: 'Vehicle image is required'
    }).url('Vehicle image must be a valid URL'),
    rcNumber: z.string({
      required_error: 'RC number is required'
    }).min(1, 'RC number cannot be empty'),
    rcImage: z.string({
      required_error: 'RC image is required'
    }).url('RC image must be a valid URL'),
    insuranceExpiry: z.string({
      required_error: 'Insurance expiry date is required'
    }).transform((val) => new Date(val)),
    pollutionExpiry: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    isDefault: z.boolean().optional()
  })
});

export const UpdateVehicleSchema = z.object({
  body: z.object({
    vehicleNumber: z.string().min(1, 'Vehicle number cannot be empty').optional(),
    type: VehicleTypeSchema.optional(),
    brand: z.string().min(1, 'Brand cannot be empty').optional(),
    model: z.string().min(1, 'Model cannot be empty').optional(),
    color: z.string().min(1, 'Color cannot be empty').optional(),
    fuelType: FuelTypeSchema.optional(),
    seatingCapacity: z.number().int().min(1, 'Seating capacity must be at least 1').max(8, 'Seating capacity cannot exceed 8').optional(),
    registrationYear: z.number().int().optional(),
    vehicleImage: z.string().url('Vehicle image must be a valid URL').optional(),
    rcNumber: z.string().min(1, 'RC number cannot be empty').optional(),
    rcImage: z.string().url('RC image must be a valid URL').optional(),
    insuranceExpiry: z.string().transform((val) => new Date(val)).optional(),
    pollutionExpiry: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    isDefault: z.boolean().optional(),
    status: VehicleStatusSchema.optional()
  })
});
