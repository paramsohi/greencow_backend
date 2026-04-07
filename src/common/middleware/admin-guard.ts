import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api-error';

export const adminGuard = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.auth) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (req.auth.role !== 'ADMIN') {
    return next(new ApiError(403, 'Forbidden: Admin access required'));
  }

  return next();
};
