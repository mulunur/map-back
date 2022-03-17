import { NextFunction, Request, Response } from 'express';
import { Constants } from '../utils/constants';
import { throwError } from '../utils/http-exception';

export const requireLocalhost = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host;
  if (!host || !host.includes(Constants.LOCALHOST_MASK)) {
    throwError({
      statusCode: 404,
      message: 'Endpoint no found',
    });
  }

  next();
};
