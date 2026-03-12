import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { reportsService } from '../services/reports.service';

export const dailySalesSummary = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportsService.dailySalesSummary(Number(req.params.userId), req.query.date as string | undefined);
  res.status(200).json({ success: true, message: 'Daily sales summary fetched', data });
});

export const monthlySummary = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportsService.monthlySummary(Number(req.params.userId), req.query.month as string | undefined);
  res.status(200).json({ success: true, message: 'Monthly summary fetched', data });
});

export const customerLedger = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportsService.customerLedger(
    Number(req.params.userId),
    Number(req.params.customerId),
    req.query.fromDate as string | undefined,
    req.query.toDate as string | undefined,
  );

  res.status(200).json({ success: true, message: 'Customer ledger fetched', data });
});
