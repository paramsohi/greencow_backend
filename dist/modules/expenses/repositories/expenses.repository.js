"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesRepository = exports.ExpensesRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class ExpensesRepository {
    create(userId, data) {
        return prisma_1.prisma.expenseRecord.create({
            data: { userId, ...data },
        });
    }
    list(userId, where, skip, take, orderBy) {
        return prisma_1.prisma.expenseRecord.findMany({
            where: { userId, deletedAt: null, ...where },
            skip,
            take,
            orderBy,
        });
    }
    count(userId, where) {
        return prisma_1.prisma.expenseRecord.count({ where: { userId, deletedAt: null, ...where } });
    }
    findById(expenseId) {
        return prisma_1.prisma.expenseRecord.findFirst({ where: { id: expenseId, deletedAt: null } });
    }
    update(expenseId, data) {
        return prisma_1.prisma.expenseRecord.update({ where: { id: expenseId }, data });
    }
    softDelete(expenseId) {
        return prisma_1.prisma.expenseRecord.update({ where: { id: expenseId }, data: { deletedAt: new Date() } });
    }
}
exports.ExpensesRepository = ExpensesRepository;
exports.expensesRepository = new ExpensesRepository();
//# sourceMappingURL=expenses.repository.js.map