import { Request, Response } from 'express';
import { asyncHandler } from '../../../../common/middleware/async-handler';
import { adminDataService } from '../services/admin-data.service';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminDataService.getAllUsers(page, limit);
  res.status(200).json({ success: true, message: 'Users fetched', data: result.items, meta: result.meta });
});

export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminDataService.getAllCustomers(page, limit);
  res.status(200).json({ success: true, message: 'Customers fetched', data: result.items, meta: result.meta });
});

export const getAllSales = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminDataService.getAllSales(page, limit);
  res.status(200).json({ success: true, message: 'Sales fetched', data: result.items, meta: result.meta });
});

export const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminDataService.getAllPayments(page, limit);
  res.status(200).json({ success: true, message: 'Payments fetched', data: result.items, meta: result.meta });
});

export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminDataService.getAllExpenses(page, limit);
  res.status(200).json({ success: true, message: 'Expenses fetched', data: result.items, meta: result.meta });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await adminDataService.getDashboardStats();
  res.status(200).json({ success: true, message: 'Dashboard stats fetched', data: stats });
});
