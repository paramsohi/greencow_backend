import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { paymentsService } from '../services/payments.service';

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const data = await paymentsService.create(Number(req.params.userId), req.body);
  res.status(201).json({ success: true, message: 'Payment record created', data });
});

export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentsService.list(Number(req.params.userId), req.query as Record<string, unknown>);
  res.status(200).json({ success: true, message: 'Payment records fetched', data: result.items, meta: result.meta });
});

export const listPaymentsByCustomer = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentsService.listByCustomer(
    Number(req.params.customerId),
    req.auth!.userId,
    req.query as Record<string, unknown>
  );
  res.status(200).json({ success: true, message: 'Payment records fetched', data: result.items, meta: result.meta });
});

export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const data = await paymentsService.update(Number(req.params.paymentId), req.auth!.userId, req.body);
  res.status(200).json({ success: true, message: 'Payment record updated', data });
});

export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  await paymentsService.remove(Number(req.params.paymentId), req.auth!.userId);
  res.status(200).json({ success: true, message: 'Payment record deleted' });
});
