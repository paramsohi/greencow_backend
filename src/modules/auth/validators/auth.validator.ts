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

const phoneSchema = z
  .string()
  .trim()
  .min(8, 'Phone must be at least 8 characters')
  .max(20, 'Phone cannot exceed 20 characters')
  .regex(/^[+]?\d+$/, 'Phone must contain only digits and optional leading +');

export const requestPhoneOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
  params: z.object({}),
  query: z.object({}),
});

export const verifyPhoneOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: z.string().trim().min(6, 'OTP must be at least 6 characters').max(6, 'OTP cannot exceed 6 characters'),
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

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().trim().min(1).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});