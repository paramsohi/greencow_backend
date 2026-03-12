"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.listExpenses = exports.createExpense = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const expenses_service_1 = require("../services/expenses.service");
exports.createExpense = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await expenses_service_1.expensesService.create(Number(req.params.userId), req.body);
    res.status(201).json({ success: true, message: 'Expense record created', data });
});
exports.listExpenses = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await expenses_service_1.expensesService.list(Number(req.params.userId), req.query);
    res.status(200).json({ success: true, message: 'Expense records fetched', data: result.items, meta: result.meta });
});
exports.updateExpense = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await expenses_service_1.expensesService.update(Number(req.params.expenseId), req.auth.userId, req.body);
    res.status(200).json({ success: true, message: 'Expense record updated', data });
});
exports.deleteExpense = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await expenses_service_1.expensesService.remove(Number(req.params.expenseId), req.auth.userId);
    res.status(200).json({ success: true, message: 'Expense record deleted' });
});
//# sourceMappingURL=expenses.controller.js.map