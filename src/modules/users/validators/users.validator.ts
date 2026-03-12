import { z } from 'zod';

const dairySettingsSchema = z.object({
  buffaloes: z.number().int().nonnegative(),
  cows: z.number().int().nonnegative(),
  sheep: z.number().int().nonnegative(),
});

export const userIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().max(50).optional(),
    businessName: z.string().max(100).optional(),
    businessAddress: z.string().max(255).optional(),
    dairySettings: dairySettingsSchema.optional(),
    hasCompletedDairySetup: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});
