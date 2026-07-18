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
