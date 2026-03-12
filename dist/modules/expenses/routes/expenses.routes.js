"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const expenses_controller_1 = require("../controllers/expenses.controller");
const expenses_validator_1 = require("../validators/expenses.validator");
exports.expenseRoutes = (0, express_1.Router)();
exports.expenseRoutes.post('/users/:userId/expenses', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(expenses_validator_1.createExpenseSchema), expenses_controller_1.createExpense);
exports.expenseRoutes.get('/users/:userId/expenses', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(expenses_validator_1.listExpensesSchema), expenses_controller_1.listExpenses);
exports.expenseRoutes.patch('/expenses/:expenseId', auth_1.authGuard, (0, validate_1.validate)(expenses_validator_1.updateExpenseSchema), expenses_controller_1.updateExpense);
exports.expenseRoutes.delete('/expenses/:expenseId', auth_1.authGuard, (0, validate_1.validate)(expenses_validator_1.expenseIdSchema), expenses_controller_1.deleteExpense);
//# sourceMappingURL=expenses.routes.js.map