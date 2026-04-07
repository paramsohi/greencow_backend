import { Router } from 'express';
import { adminSessionGuard, adminAlreadyLoggedIn } from '../../../../common/middleware/admin-session';
import {
  getLoginPage,
  postLogin,
  getLogout,
  getDashboard,
  getLogs,
} from '../controllers/admin-ui.controller';

export const adminUiRoutes = Router();

// Public routes
adminUiRoutes.get('/login', adminAlreadyLoggedIn, getLoginPage);
adminUiRoutes.post('/login', adminAlreadyLoggedIn, postLogin);

// Protected routes
adminUiRoutes.get('/logout', adminSessionGuard, getLogout);
adminUiRoutes.get('/dashboard', adminSessionGuard, getDashboard);
adminUiRoutes.get('/logs', adminSessionGuard, getLogs);
