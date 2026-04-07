import { NextFunction, Request, Response } from 'express';

// Extend Express Session
declare module 'express-session' {
  interface SessionData {
    adminId?: number;
    adminEmail?: string;
  }
}

export const adminSessionGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.adminId) {
    return next();
  }
  return res.redirect('/admin/login?redirect=' + encodeURIComponent(req.originalUrl));
};

export const adminAlreadyLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.adminId) {
    return res.redirect('/admin/dashboard');
  }
  return next();
};
