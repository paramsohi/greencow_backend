import { Router } from 'express';
import { authGuard } from '../../../../common/middleware/auth';
import { adminGuard } from '../../../../common/middleware/admin-guard';
import {
  getAllUsers,
  getAllCustomers,
  getAllSales,
  getAllPayments,
  getAllExpenses,
  getDashboardStats,
} from '../controllers/admin-data.controller';

export const adminDataRoutes = Router();

// All routes require both auth and admin.
adminDataRoutes.use(authGuard, adminGuard);

adminDataRoutes.get('/dashboard', getDashboardStats);
adminDataRoutes.get('/users', getAllUsers);
adminDataRoutes.get('/customers', getAllCustomers);
adminDataRoutes.get('/sales', getAllSales);
adminDataRoutes.get('/payments', getAllPayments);
adminDataRoutes.get('/expenses', getAllExpenses);
