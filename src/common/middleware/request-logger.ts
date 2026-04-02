import { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger';
import { prisma } from '../../config/prisma';

const MAX_SERIALIZED_LENGTH = 16_000;
const MAX_DEPTH = 6;
const MASK = '[REDACTED]';
const SENSITIVE_KEYS = ['password', 'token', 'authorization'];

const isSensitiveKey = (key: string): boolean => {
  const normalizedKey = key.toLowerCase();
  return SENSITIVE_KEYS.some((sensitiveKey) => normalizedKey.includes(sensitiveKey));
};

const sanitizeValue = (value: unknown, depth = 0, seen = new WeakSet<object>()): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth >= MAX_DEPTH) {
    return '[MaxDepthExceeded]';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Buffer.isBuffer(value)) {
    return `[Buffer:${value.length}]`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1, seen));
  }

  if (typeof value === 'object') {
    if (seen.has(value as object)) {
      return '[Circular]';
    }

    seen.add(value as object);

    const sanitizedEntries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
      key,
      isSensitiveKey(key) ? MASK : sanitizeValue(entryValue, depth + 1, seen),
    ]);

    return Object.fromEntries(sanitizedEntries);
  }

  return String(value);
};

const serializeForStorage = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as Record<string, unknown>).length === 0) {
    return null;
  }

  try {
    const serialized = JSON.stringify(sanitizeValue(value));
    if (!serialized) {
      return null;
    }

    if (serialized.length > MAX_SERIALIZED_LENGTH) {
      return `${serialized.slice(0, MAX_SERIALIZED_LENGTH)}... [TRUNCATED ${serialized.length - MAX_SERIALIZED_LENGTH} chars]`;
    }

    return serialized;
  } catch (error) {
    logger.warn({ err: error }, 'Failed to serialize request log payload');
    return JSON.stringify({ error: 'Serialization failed' });
  }
};

const captureResponsePayload = (res: Response) => {
  let responseBody: unknown;

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = ((body: unknown) => {
    responseBody = body;
    return originalJson(body);
  }) as Response['json'];

  res.send = ((body?: unknown) => {
    if (responseBody === undefined) {
      responseBody = body;
    }

    return originalSend(body);
  }) as Response['send'];

  return () => responseBody;
};

const persistRequestLog = async (req: Request, res: Response, startedAt: bigint, responseBody: unknown) => {
  const responseTime = Number((process.hrtime.bigint() - startedAt) / BigInt(1_000_000));

  try {
    await prisma.apiLog.create({
      data: {
        method: req.method,
        url: req.originalUrl || req.url,
        headers: serializeForStorage(req.headers) ?? '{}',
        body: serializeForStorage(req.body),
        response: serializeForStorage(responseBody),
        status: res.statusCode,
        responseTime,
      },
    });
  } catch (error) {
    logger.warn({ err: error, method: req.method, url: req.originalUrl || req.url }, 'Failed to persist API request log');
  }
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = process.hrtime.bigint();
  const getResponseBody = captureResponsePayload(res);

  res.once('finish', () => {
    void persistRequestLog(req, res, startedAt, getResponseBody());
  });

  next();
};