import { z } from 'zod';

const listQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    openingBalance: z.coerce.number().optional(),
  }),
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});

export const listCustomerSchema = z.object({
  body: z.object({}),
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
  query: listQuery,
});

export const customerIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    customerId: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
    openingBalance: z.coerce.number().optional(),
  }),
  params: z.object({
    customerId: z.coerce.number().int().positive(),
  }),
  query: z.object({}),
});
