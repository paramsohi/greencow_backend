import { startOfDay, endOfDay, endOfMonth, startOfMonth } from '../../../common/utils/date';
import { reportsRepository } from '../repositories/reports.repository';

export class ReportsService {
  async dailySalesSummary(userId: number, date?: string) {
    const selected = date ? new Date(date) : new Date();
    const result = await reportsRepository.dailySalesSummary(userId, startOfDay(selected), endOfDay(selected));

    return {
      date: selected.toISOString().slice(0, 10),
      totalSalesEntries: result._count.id,
      totalQuantityLiters: Number(result._sum.quantityLiters ?? 0),
      totalRevenue: Number(result._sum.totalAmount ?? 0),
    };
  }

  async monthlySummary(userId: number, month?: string) {
    const selected = month ? new Date(`${month}-01T00:00:00.000Z`) : new Date();
    const start = startOfMonth(selected);
    const end = endOfMonth(selected);

    const [sales, payments, expenses] = await Promise.all([
      reportsRepository.monthlySalesSummary(userId, start, end),
      reportsRepository.monthlyPaymentSummary(userId, start, end),
      reportsRepository.monthlyExpenseSummary(userId, start, end),
    ]);

    const revenue = Number(sales._sum.totalAmount ?? 0);
    const collections = Number(payments._sum.amount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);

    return {
      month: `${selected.getUTCFullYear()}-${String(selected.getUTCMonth() + 1).padStart(2, '0')}`,
      salesEntriesCount: sales._count.id,
      revenue,
      collections,
      expenses: totalExpenses,
      netCashFlow: collections - totalExpenses,
      receivablesGenerated: revenue - collections,
    };
  }

  async customerLedger(userId: number, customerId: number, fromDate?: string, toDate?: string) {
    const start = fromDate ? new Date(fromDate) : undefined;
    const end = toDate ? new Date(toDate) : undefined;

    const [sales, payments] = await Promise.all([
      reportsRepository.customerLedgerSales(userId, customerId, start, end),
      reportsRepository.customerLedgerPayments(userId, customerId, start, end),
    ]);

    const totalSales = sales.reduce(
      (acc: number, item: { totalAmount: unknown }) => acc + Number(item.totalAmount),
      0,
    );
    const totalPayments = payments.reduce(
      (acc: number, item: { amount: unknown }) => acc + Number(item.amount),
      0,
    );

    return {
      customerId,
      period: {
        fromDate: fromDate ?? null,
        toDate: toDate ?? null,
      },
      totals: {
        totalSales,
        totalPayments,
        outstanding: totalSales - totalPayments,
      },
      sales,
      payments,
    };
  }
}

export const reportsService = new ReportsService();
