import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { authService } from '../services/auth.service';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.signup(req.body);
  res.status(201).json({ success: true, message: 'Signup successful', data });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, message: 'Login successful', data });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.refresh(req.body.refreshToken);
  res.status(200).json({ success: true, message: 'Token refreshed', data });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(200).json({ success: true, message: 'Logout successful' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.me(req.auth!.userId);
  res.status(200).json({ success: true, message: 'Current user fetched', data });
});
