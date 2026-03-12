import { z } from 'zod';

const listQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  customerId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const createPaymentSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive(),
    paymentDate: z.string().datetime(),
    amount: z.coerce.number().positive(),
    paymentMethod: z.string().min(2).max(50),
    reference: z.string().max(100).optional(),
    notes: z.string().max(255).optional(),
  }),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const listPaymentsSchema = z.object({
  body: z.object({}),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: listQuery,
});

export const paymentIdSchema = z.object({
  body: z.object({}),
  params: z.object({ paymentId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive().optional(),
    paymentDate: z.string().datetime().optional(),
    amount: z.coerce.number().positive().optional(),
    paymentMethod: z.string().min(2).max(50).optional(),
    reference: z.string().max(100).optional(),
    notes: z.string().max(255).optional(),
  }),
  params: z.object({ paymentId: z.coerce.number().int().positive() }),
  query: z.object({}),
});
