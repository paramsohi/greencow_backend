import { z } from 'zod';

export const userReportsQuerySchema = z.object({
  body: z.object({}),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: z.object({
    date: z.string().optional(),
    month: z.string().optional(),
  }),
});

export const customerLedgerSchema = z.object({
  body: z.object({}),
  params: z.object({
    userId: z.coerce.number().int().positive(),
    customerId: z.coerce.number().int().positive(),
  }),
  query: z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
  }),
});
