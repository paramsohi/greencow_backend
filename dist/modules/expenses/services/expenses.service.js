"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesService = exports.ExpensesService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const pagination_1 = require("../../../common/utils/pagination");
const expenses_repository_1 = require("../repositories/expenses.repository");
class ExpensesService {
    create(userId, body) {
        return expenses_repository_1.expensesRepository.create(userId, {
            ...body,
            expenseDate: new Date(body.expenseDate),
        });
    }
    async list(userId, query) {
        const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.parsePagination)({ query });
        const where = {
            ...(query.category ? { category: { contains: String(query.category) } } : {}),
            ...(query.fromDate || query.toDate
                ? {
                    expenseDate: {
                        ...(query.fromDate ? { gte: new Date(String(query.fromDate)) } : {}),
                        ...(query.toDate ? { lte: new Date(String(query.toDate)) } : {}),
                    },
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            expenses_repository_1.expensesRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
            expenses_repository_1.expensesRepository.count(userId, where),
        ]);
        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async owned(expenseId, authUserId) {
        const expense = await expenses_repository_1.expensesRepository.findById(expenseId);
        if (!expense || expense.userId !== authUserId) {
            throw new api_error_1.ApiError(404, 'Expense record not found');
        }
        return expense;
    }
    async update(expenseId, authUserId, body) {
        await this.owned(expenseId, authUserId);
        return expenses_repository_1.expensesRepository.update(expenseId, {
            ...(body.expenseDate ? { expenseDate: new Date(body.expenseDate) } : {}),
            ...(body.category ? { category: body.category } : {}),
            ...(body.amount !== undefined ? { amount: body.amount } : {}),
            ...(body.description !== undefined ? { description: body.description } : {}),
        });
    }
    async remove(expenseId, authUserId) {
        await this.owned(expenseId, authUserId);
        await expenses_repository_1.expensesRepository.softDelete(expenseId);
    }
}
exports.ExpensesService = ExpensesService;
exports.expensesService = new ExpensesService();
//# sourceMappingURL=expenses.service.js.map