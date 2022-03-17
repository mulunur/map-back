import { NextFunction, Request, Response } from 'express';
import { ErrorReasons } from '../utils/constants';
import { throwError } from '../utils/http-exception';

export const notFound = (req: Request, _: Response, next: NextFunction) => {
  next(
    throwError({
      statusCode: 404,
      message: `Not found - ${req.originalUrl} ${req.method}`,
      reason: ErrorReasons.NOT_FOUND,
    })
  );
};
