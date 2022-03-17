import { NextFunction, Request, Response } from 'express';
import Log from '../utils/utils-log';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  let log = {
    url: req.url,
    originalUrl: req.originalUrl,
    method: req.method,
    host: req.headers.host,
    isSecure: req.secure,
    headers: req.headers,
    body: req.body,
    query: req.query,
  };
  Log.info('REQ:', JSON.stringify(log, null, 2));

  next();
}
