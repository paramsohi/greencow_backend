import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { salesService } from '../services/sales.service';

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const data = await salesService.create(Number(req.params.userId), req.body);
  res.status(201).json({ success: true, message: 'Sale entry created', data });
});

export const listSales = asyncHandler(async (req: Request, res: Response) => {
  const result = await salesService.list(Number(req.params.userId), req.query as Record<string, unknown>);
  res.status(200).json({ success: true, message: 'Sales entries fetched', data: result.items, meta: result.meta });
});

export const updateSale = asyncHandler(async (req: Request, res: Response) => {
  const data = await salesService.update(Number(req.params.saleId), req.auth!.userId, req.body);
  res.status(200).json({ success: true, message: 'Sale entry updated', data });
});

export const deleteSale = asyncHandler(async (req: Request, res: Response) => {
  await salesService.remove(Number(req.params.saleId), req.auth!.userId);
  res.status(200).json({ success: true, message: 'Sale entry deleted' });
});
