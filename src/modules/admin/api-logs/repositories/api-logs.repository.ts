import { Prisma } from '@prisma/client';
import { prisma } from '../../../../config/prisma';

export class ApiLogsRepository {
  list(where: Prisma.ApiLogWhereInput, skip: number, take: number) {
    return prisma.apiLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(where: Prisma.ApiLogWhereInput) {
    return prisma.apiLog.count({ where });
  }

  deleteOlderThan(cutoff: Date) {
    return prisma.apiLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    });
  }
}

export const apiLogsRepository = new ApiLogsRepository();