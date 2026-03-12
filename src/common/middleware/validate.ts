import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';
import { ApiError } from '../errors/api-error';

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    });

    if (!result.success) {
      return next(new ApiError(400, 'Validation failed', result.error.flatten()));
    }

    const parsed = result.data as {
      body: Request['body'];
    };

    // Express 5 exposes req.query/req.params via getters; avoid reassigning them.
    req.body = parsed.body;
    return next();
  };
};
