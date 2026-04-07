import { Request, Response } from 'express';
import { asyncHandler } from '../../../../common/middleware/async-handler';
import { adminUiService } from '../services/admin-ui.service';

export const getLoginPage = asyncHandler(async (_req: Request, res: Response) => {
  res.render('admin/login', { title: 'Admin Login', error: null });
});

export const postLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('admin/login', {
      title: 'Admin Login',
      error: 'Email and password are required',
    });
  }

  try {
    const admin = await adminUiService.validateAdmin(email, password);
    if (!admin) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid email or password',
      });
    }

    // Store in session
    if (req.session) {
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
    }

    // Log successful login
    await adminUiService.logAdminActivity(admin.id, 'LOGIN', 'Admin logged in', req.ip);

    return res.redirect('/admin/dashboard');
  } catch (error: any) {
    console.error('Login error:', error);
    return res.render('admin/login', {
      title: 'Admin Login',
      error: 'An error occurred during login',
    });
  }
});

export const getLogout = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.session?.adminId;
  const adminEmail = req.session?.adminEmail;

  if (adminId) {
    await adminUiService.logAdminActivity(adminId, 'LOGOUT', 'Admin logged out', req.ip);
  }

  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/admin/login');
    });
  } else {
    res.redirect('/admin/login');
  }
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const stats = await adminUiService.getDashboardStats();
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    stats,
    adminEmail: req.session?.adminEmail,
  });
});

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await adminUiService.getAdminLogs(page, limit);

  res.render('admin/logs', {
    title: 'Admin Logs',
    logs: result.items,
    meta: result.meta,
    adminEmail: req.session?.adminEmail,
    currentPage: page,
  });
});
