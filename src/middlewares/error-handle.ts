import { Response, NextFunction, Request } from 'express';
import { HttpException } from '../utils/http-exception';
import { ErrorReasons } from '../utils/constants';
import Log from '../utils/utils-log';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Log.error(err.message, err);

  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      message: err.message,
      reason: err.reason,
    });
  }

  return res.status(500).json({
    message: err.message,
    reason: ErrorReasons.SERVER_ERROR,
  });
};
