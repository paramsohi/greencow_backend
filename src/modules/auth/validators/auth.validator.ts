import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2).max(100),
    phone: z.string().max(50).optional(),
    businessName: z.string().max(100).optional(),
    businessAddress: z.string().max(255).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const logoutSchema = refreshSchema;