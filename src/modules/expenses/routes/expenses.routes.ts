import { Router } from 'express';
import { authGuard, ownershipGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../controllers/expenses.controller';
import {
  createExpenseSchema,
  expenseIdSchema,
  listExpensesSchema,
  updateExpenseSchema,
} from '../validators/expenses.validator';

export const expenseRoutes = Router();

expenseRoutes.post('/users/:userId/expenses', authGuard, ownershipGuard, validate(createExpenseSchema), createExpense);
expenseRoutes.get('/users/:userId/expenses', authGuard, ownershipGuard, validate(listExpensesSchema), listExpenses);
expenseRoutes.patch('/expenses/:expenseId', authGuard, validate(updateExpenseSchema), updateExpense);
expenseRoutes.delete('/expenses/:expenseId', authGuard, validate(expenseIdSchema), deleteExpense);
