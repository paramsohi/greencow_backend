import { Router } from 'express';
import { adminAuthRoutes } from './auth/routes';
import { adminDataRoutes } from './data/routes';
import { adminUiRoutes } from './ui/routes/admin-ui.routes';
import { apiLogsRoutes } from './api-logs/routes';

export const adminRouter = Router();

// API routes (JWT authenticated)
adminRouter.use('/auth', adminAuthRoutes);
adminRouter.use('/data', adminDataRoutes);
adminRouter.use('/api-logs', apiLogsRoutes);

// UI routes (Session authenticated)
adminRouter.use('/', adminUiRoutes);