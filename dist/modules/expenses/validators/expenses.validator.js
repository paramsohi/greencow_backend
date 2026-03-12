"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.expenseIdSchema = exports.listExpensesSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
const listQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    category: zod_1.z.string().optional(),
    fromDate: zod_1.z.string().optional(),
    toDate: zod_1.z.string().optional(),
});
exports.createExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        expenseDate: zod_1.z.string().datetime(),
        category: zod_1.z.string().min(2).max(100),
        amount: zod_1.z.coerce.number().positive(),
        description: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.listExpensesSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: listQuery,
});
exports.expenseIdSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ expenseId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.updateExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        expenseDate: zod_1.z.string().datetime().optional(),
        category: zod_1.z.string().min(2).max(100).optional(),
        amount: zod_1.z.coerce.number().positive().optional(),
        description: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ expenseId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=expenses.validator.js.map