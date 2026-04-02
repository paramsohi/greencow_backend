import { Request, Response } from 'express';
import { asyncHandler } from '../../../../common/middleware/async-handler';
import { apiLogsService } from '../services/api-logs.service';
import { renderApiLogsDashboard, renderApiLogsDashboardScript } from '../views/api-logs-dashboard';

export const listApiLogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await apiLogsService.list(req.query as Record<string, unknown>);

  res.status(200).json({
    success: true,
    message: 'API logs fetched',
    data: result.items,
    meta: result.meta,
  });
});

export const cleanupApiLogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await apiLogsService.cleanup(req.query as Record<string, unknown>);

  res.status(200).json({
    success: true,
    message: 'Old API logs deleted',
    data: result,
  });
});

export const viewApiLogsDashboard = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).type('html').send(renderApiLogsDashboard());
});

export const viewApiLogsDashboardScript = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).type('application/javascript').send(renderApiLogsDashboardScript());
});