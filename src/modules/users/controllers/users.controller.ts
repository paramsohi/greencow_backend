import { Request, Response } from 'express';
import { asyncHandler } from '../../../common/middleware/async-handler';
import { usersService } from '../services/users.service';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const data = await usersService.getById(userId);
  res.status(200).json({ success: true, message: 'User fetched', data });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const data = await usersService.update(userId, req.body);
  res.status(200).json({ success: true, message: 'User updated', data });
});
