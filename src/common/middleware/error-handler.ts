import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../../config/logger';
import { ApiError } from '../errors/api-error';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 REAL ERROR:", err); // 👈 ADD THIS

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.flatten(),
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error({ err }, 'Database initialization error');

    return res.status(503).json({
      success: false,
      message: 'Database is unavailable. Ensure MySQL is running and try again.',
    });
  }

  // 👇 IMPORTANT CHANGE
  logger.error({ err }, 'Unhandled server error');

  return res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined, // 👈 add this
  });
};
