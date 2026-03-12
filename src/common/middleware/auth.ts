import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api-error';
import { JwtPayload, verifyAccessToken } from '../utils/tokens';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing or invalid authorization header'));
  }

  const token = header.substring(7);

  try {
    const payload = verifyAccessToken(token) as JwtPayload & { id?: unknown };
    const normalizedUserId = Number(payload.userId ?? payload.id);
    const normalizedRole = typeof payload.role === 'string' ? payload.role.toUpperCase() : '';

    if (!Number.isInteger(normalizedUserId) || !payload.email || !normalizedRole) {
      return next(new ApiError(401, 'Invalid access token payload'));
    }

    req.auth = {
      userId: normalizedUserId,
      email: payload.email,
      role: normalizedRole,
    };
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};

export const ownershipGuard = (req: Request, _res: Response, next: NextFunction) => {
  const paramUserId = Number(req.params.userId);
  if (!req.auth) {
    return next(new ApiError(401, 'Unauthorized'));
  }
  if (Number.isNaN(paramUserId)) {
    return next(new ApiError(400, 'Invalid userId parameter'));
  }

  if (req.auth.userId !== paramUserId) {
    if (req.auth.role === 'OWNER') {
      return next(new ApiError(403, 'Owner can only access own records in this API'));
    }
    return next(new ApiError(403, 'Forbidden'));
  }

  return next();
};
