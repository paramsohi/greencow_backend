import { prisma } from '../../../config/prisma';

export class ExpensesRepository {
  create(userId: number, data: { expenseDate: Date; category: string; amount: number; description?: string }) {
    return prisma.expenseRecord.create({
      data: { userId, ...data },
    });
  }

  list(userId: number, where: Record<string, unknown>, skip: number, take: number, orderBy: Record<string, unknown>) {
    return prisma.expenseRecord.findMany({
      where: { userId, deletedAt: null, ...where },
      skip,
      take,
      orderBy,
    });
  }

  count(userId: number, where: Record<string, unknown>) {
    return prisma.expenseRecord.count({ where: { userId, deletedAt: null, ...where } });
  }

  findById(expenseId: number) {
    return prisma.expenseRecord.findFirst({ where: { id: expenseId, deletedAt: null } });
  }

  update(expenseId: number, data: Record<string, unknown>) {
    return prisma.expenseRecord.update({ where: { id: expenseId }, data });
  }

  softDelete(expenseId: number) {
    return prisma.expenseRecord.update({ where: { id: expenseId }, data: { deletedAt: new Date() } });
  }
}

export const expensesRepository = new ExpensesRepository();
