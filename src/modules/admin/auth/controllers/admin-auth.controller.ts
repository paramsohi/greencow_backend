import { Request, Response } from 'express';
import { asyncHandler } from '../../../../common/middleware/async-handler';
import { adminAuthService } from '../services/admin-auth.service';

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const data = await adminAuthService.adminLogin(req.body);
  res.status(200).json({ success: true, message: 'Admin login successful', data });
});

export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  await adminAuthService.adminLogout(req.body.refreshToken);
  res.status(200).json({ success: true, message: 'Admin logout successful' });
});
