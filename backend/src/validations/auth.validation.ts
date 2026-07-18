import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    loginId: z.string({
      required_error: 'Login ID (email or employee ID) is required',
    }).min(1, 'Login ID cannot be empty'),
    password: z.string({
      required_error: 'Password is required',
    }).min(1, 'Password cannot be empty'),
  }),
});

export const ChangePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Current password is required',
    }).min(1, 'Current password cannot be empty'),
    newPassword: z.string({
      required_error: 'New password is required',
    }).min(8, 'New password must be at least 8 characters long'),
  }),
});

export const RegisterSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().default('MALE'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    
    // Driver specific fields (optional)
    vehiclePhoto: z.string().optional(),
    rcPhoto: z.string().optional(),
    vehicleNumber: z.string().optional(),
    vehicleType: z.enum(['HATCHBACK', 'SEDAN', 'SUV', 'BIKE', 'OTHER']).optional(),
    fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'EV', 'HYBRID']).optional(),
    availableSeats: z.union([z.string(), z.number()]).optional(),
  }),
});
