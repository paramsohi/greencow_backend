import { prisma } from '../../../config/prisma';

export class ReportsRepository {
  dailySalesSummary(userId: number, start: Date, end: Date) {
    return prisma.salesEntry.aggregate({
      where: {
        userId,
        deletedAt: null,
        saleDate: { gte: start, lte: end },
      },
      _sum: {
        quantityLiters: true,
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });
  }

  monthlySalesSummary(userId: number, start: Date, end: Date) {
    return prisma.salesEntry.aggregate({
      where: {
        userId,
        deletedAt: null,
        saleDate: { gte: start, lte: end },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });
  }

  monthlyPaymentSummary(userId: number, start: Date, end: Date) {
    return prisma.paymentRecord.aggregate({
      where: {
        userId,
        deletedAt: null,
        paymentDate: { gte: start, lte: end },
      },
      _sum: {
        amount: true,
      },
    });
  }

  monthlyExpenseSummary(userId: number, start: Date, end: Date) {
    return prisma.expenseRecord.aggregate({
      where: {
        userId,
        deletedAt: null,
        expenseDate: { gte: start, lte: end },
      },
      _sum: {
        amount: true,
      },
    });
  }

  customerLedgerSales(userId: number, customerId: number, start?: Date, end?: Date) {
    return prisma.salesEntry.findMany({
      where: {
        userId,
        customerId,
        deletedAt: null,
        ...(start || end
          ? {
              saleDate: {
                ...(start ? { gte: start } : {}),
                ...(end ? { lte: end } : {}),
              },
            }
          : {}),
      },
      orderBy: { saleDate: 'asc' },
      select: { id: true, saleDate: true, totalAmount: true, notes: true },
    });
  }

  customerLedgerPayments(userId: number, customerId: number, start?: Date, end?: Date) {
    return prisma.paymentRecord.findMany({
      where: {
        userId,
        customerId,
        deletedAt: null,
        ...(start || end
          ? {
              paymentDate: {
                ...(start ? { gte: start } : {}),
                ...(end ? { lte: end } : {}),
              },
            }
          : {}),
      },
      orderBy: { paymentDate: 'asc' },
      select: { id: true, paymentDate: true, amount: true, notes: true, paymentMethod: true },
    });
  }
}

export const reportsRepository = new ReportsRepository();
