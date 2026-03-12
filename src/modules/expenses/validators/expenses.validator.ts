import { z } from 'zod';

const listQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  category: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const createExpenseSchema = z.object({
  body: z.object({
    expenseDate: z.string().datetime(),
    category: z.string().min(2).max(100),
    amount: z.coerce.number().positive(),
    description: z.string().max(255).optional(),
  }),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const listExpensesSchema = z.object({
  body: z.object({}),
  params: z.object({ userId: z.coerce.number().int().positive() }),
  query: listQuery,
});

export const expenseIdSchema = z.object({
  body: z.object({}),
  params: z.object({ expenseId: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    expenseDate: z.string().datetime().optional(),
    category: z.string().min(2).max(100).optional(),
    amount: z.coerce.number().positive().optional(),
    description: z.string().max(255).optional(),
  }),
  params: z.object({ expenseId: z.coerce.number().int().positive() }),
  query: z.object({}),
});
