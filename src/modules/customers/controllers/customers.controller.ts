import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { customersService } from '../services/customers.service';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const data = await customersService.create(userId, req.body);
  res.status(201).json({ success: true, message: 'Customer created', data });
});

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;
  const result = await customersService.list(userId, req.query as Record<string, unknown>);
  res.status(200).json({ success: true, message: 'Customers fetched', data: result.items, meta: result.meta });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const data = await customersService.getById(Number(req.params.customerId), req.auth!.userId);
  res.status(200).json({ success: true, message: 'Customer fetched', data });
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const data = await customersService.update(Number(req.params.customerId), req.auth!.userId, req.body);
  res.status(200).json({ success: true, message: 'Customer updated', data });
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  await customersService.remove(Number(req.params.customerId), req.auth!.userId);
  res.status(200).json({ success: true, message: 'Customer deleted' });
});
