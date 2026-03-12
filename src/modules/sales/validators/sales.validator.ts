import { z } from 'zod';

const listQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  customerId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  productType: z.string().optional(),
});

export const createSaleSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive().optional(),
    saleDate: z.string().datetime(),
    productType: z.string().min(2).max(100),
    quantityLiters: z.coerce.number().positive(),
    ratePerLiter: z.coerce.number().positive(),
    notes: z.string().max(255).optional(),
  }),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const listSalesSchema = z.object({
  body: z.object({}),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: listQuery,
});

export const saleIdSchema = z.object({
  body: z.object({}),
  params: z.object({ saleId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const updateSaleSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive().nullable().optional(),
    saleDate: z.string().datetime().optional(),
    productType: z.string().min(2).max(100).optional(),
    quantityLiters: z.coerce.number().positive().optional(),
    ratePerLiter: z.coerce.number().positive().optional(),
    notes: z.string().max(255).optional(),
  }),
  params: z.object({ saleId: z.coerce.number().int().positive() }),
  query: z.object({}),
});
