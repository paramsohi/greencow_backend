import { z } from 'zod';

const methodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']).optional();
const statusSchema = z
  .string()
  .trim()
  .regex(/^(?:[1-5]xx|[1-5]\d\d)$/i, 'Status must be a valid status code or class like 2xx')
  .optional();

export const listApiLogsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    method: methodSchema,
    status: statusSchema,
    url: z.string().trim().max(2048).optional(),
  }),
});

export const cleanupApiLogsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    olderThanDays: z.coerce.number().int().positive().max(90).optional(),
  }),
});