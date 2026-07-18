import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    languagePreference: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    workShift: z.string().optional(),
    profilePhoto: z.string().url().optional().or(z.literal('')),
  }),
});

export const UpdateOrganizationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logoUrl: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    address: z.string().optional(),
  }),
});
