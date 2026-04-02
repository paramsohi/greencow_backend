import { Router } from 'express';
import { apiLogsRoutes } from './api-logs/routes';

export const adminRouter = Router();

adminRouter.use('/api-logs', apiLogsRoutes);