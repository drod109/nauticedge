import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof APIError) {
    logger.warn({
      message: err.message,
      code: err.code,
      path: req.path,
      method: req.method
    });

    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code
      }
    });
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
};