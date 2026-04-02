import { Prisma } from '@prisma/client';
import { apiLogsRepository } from '../repositories/api-logs.repository';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 100;

const parsePositiveInteger = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.trunc(parsed));
};

const parseStatusFilter = (value: unknown): Prisma.IntFilter | number | undefined => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const normalized = value.trim();
  if (/^[1-5]xx$/i.test(normalized)) {
    const prefix = Number(normalized[0]);
    return {
      gte: prefix * 100,
      lt: prefix * 100 + 100,
    };
  }

  const exact = Number(normalized);
  if (Number.isInteger(exact) && exact >= 100 && exact <= 599) {
    return exact;
  }

  return undefined;
};

const buildWhere = (query: Record<string, unknown>): Prisma.ApiLogWhereInput => {
  const method = typeof query.method === 'string' ? query.method.trim().toUpperCase() : undefined;
  const url = typeof query.url === 'string' ? query.url.trim() : undefined;
  const status = parseStatusFilter(query.status);

  return {
    ...(method ? { method } : {}),
    ...(url
      ? {
          url: {
            contains: url,
          },
        }
      : {}),
    ...(status !== undefined ? { status } : {}),
  };
};

export class ApiLogsService {
  async list(query: Record<string, unknown>) {
    const page = parsePositiveInteger(query.page, 1);
    const limit = Math.min(MAX_LIMIT, parsePositiveInteger(query.limit, DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const [items, total] = await Promise.all([apiLogsRepository.list(where, skip, limit), apiLogsRepository.count(where)]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async cleanup(query: Record<string, unknown>) {
    const olderThanDays = Math.min(90, parsePositiveInteger(query.olderThanDays, 7));
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    const result = await apiLogsRepository.deleteOlderThan(cutoff);

    return {
      deletedCount: result.count,
      olderThanDays,
      cutoff,
    };
  }
}

export const apiLogsService = new ApiLogsService();