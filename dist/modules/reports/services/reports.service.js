"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsService = exports.ReportsService = void 0;
const date_1 = require("../../../common/utils/date");
const reports_repository_1 = require("../repositories/reports.repository");
class ReportsService {
    async dailySalesSummary(userId, date) {
        const selected = date ? new Date(date) : new Date();
        const result = await reports_repository_1.reportsRepository.dailySalesSummary(userId, (0, date_1.startOfDay)(selected), (0, date_1.endOfDay)(selected));
        return {
            date: selected.toISOString().slice(0, 10),
            totalSalesEntries: result._count.id,
            totalQuantityLiters: Number(result._sum.quantityLiters ?? 0),
            totalRevenue: Number(result._sum.totalAmount ?? 0),
        };
    }
    async monthlySummary(userId, month) {
        const selected = month ? new Date(`${month}-01T00:00:00.000Z`) : new Date();
        const start = (0, date_1.startOfMonth)(selected);
        const end = (0, date_1.endOfMonth)(selected);
        const [sales, payments, expenses] = await Promise.all([
            reports_repository_1.reportsRepository.monthlySalesSummary(userId, start, end),
            reports_repository_1.reportsRepository.monthlyPaymentSummary(userId, start, end),
            reports_repository_1.reportsRepository.monthlyExpenseSummary(userId, start, end),
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
    async customerLedger(userId, customerId, fromDate, toDate) {
        const start = fromDate ? new Date(fromDate) : undefined;
        const end = toDate ? new Date(toDate) : undefined;
        const [sales, payments] = await Promise.all([
            reports_repository_1.reportsRepository.customerLedgerSales(userId, customerId, start, end),
            reports_repository_1.reportsRepository.customerLedgerPayments(userId, customerId, start, end),
        ]);
        const totalSales = sales.reduce((acc, item) => acc + Number(item.totalAmount), 0);
        const totalPayments = payments.reduce((acc, item) => acc + Number(item.amount), 0);
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
exports.ReportsService = ReportsService;
exports.reportsService = new ReportsService();
//# sourceMappingURL=reports.service.js.map