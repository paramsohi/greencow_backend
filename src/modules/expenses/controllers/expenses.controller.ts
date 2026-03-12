import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { expensesService } from '../services/expenses.service';

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = await expensesService.create(Number(req.params.userId), req.body);
  res.status(201).json({ success: true, message: 'Expense record created', data });
});

export const listExpenses = asyncHandler(async (req: Request, res: Response) => {
  const result = await expensesService.list(Number(req.params.userId), req.query as Record<string, unknown>);
  res.status(200).json({ success: true, message: 'Expense records fetched', data: result.items, meta: result.meta });
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = await expensesService.update(Number(req.params.expenseId), req.auth!.userId, req.body);
  res.status(200).json({ success: true, message: 'Expense record updated', data });
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  await expensesService.remove(Number(req.params.expenseId), req.auth!.userId);
  res.status(200).json({ success: true, message: 'Expense record deleted' });
});
