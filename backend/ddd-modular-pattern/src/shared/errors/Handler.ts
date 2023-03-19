import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';

import { env } from '@config/env';

import { AppError } from './AppError';

export function handler(
  err: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  if (!(err instanceof AppError)) console.info(err);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
    });
  }

  if (env.NODE_ENV === 'production') {
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }

  if (err instanceof ValidationError) {
    return response.status(err.statusCode).json(err);
  }

  return response.status(500).json(err);
}
