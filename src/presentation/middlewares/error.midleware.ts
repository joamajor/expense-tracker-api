import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../domain/error';
import { envs } from '../../config/envs';

export class ErrorMiddleware {
  static handleError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof AppError) {
      return res.status(error.code).json({
        success: false,
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        name: 'InternalServerError',
        message: 'Sonthing was wrong!',
        details: envs.nodeEnv === 'dev' && error,
      },
    });
  }
}
