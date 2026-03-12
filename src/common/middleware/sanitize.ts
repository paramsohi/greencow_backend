import { NextFunction, Request, Response } from 'express';

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.trim().replace(/[<>]/g, '');
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const key of Object.keys(record)) {
      sanitized[key] = sanitizeValue(record[key]);
    }

    return sanitized;
  }

  return value;
};

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  req.body = sanitizeValue(req.body) as Request['body'];
  next();
};
