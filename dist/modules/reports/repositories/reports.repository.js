"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRepository = exports.ReportsRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class ReportsRepository {
    dailySalesSummary(userId, start, end) {
        return prisma_1.prisma.salesEntry.aggregate({
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
    monthlySalesSummary(userId, start, end) {
        return prisma_1.prisma.salesEntry.aggregate({
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
    monthlyPaymentSummary(userId, start, end) {
        return prisma_1.prisma.paymentRecord.aggregate({
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
    monthlyExpenseSummary(userId, start, end) {
        return prisma_1.prisma.expenseRecord.aggregate({
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
    customerLedgerSales(userId, customerId, start, end) {
        return prisma_1.prisma.salesEntry.findMany({
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
    customerLedgerPayments(userId, customerId, start, end) {
        return prisma_1.prisma.paymentRecord.findMany({
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
exports.ReportsRepository = ReportsRepository;
exports.reportsRepository = new ReportsRepository();
//# sourceMappingURL=reports.repository.js.map