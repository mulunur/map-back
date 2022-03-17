import { ErrorReasons } from './constants';

interface ExceptionOptions {
  statusCode?: number;
  message?: string;
  reason?: string;
  errorData?: any;
}

export class HttpException extends Error {
  statusCode: number;
  message: string;
  reason: string;
  errorData: any;

  constructor({
    statusCode = 400,
    message = 'Error',
    reason = ErrorReasons.BAD_REQUEST,
    errorData = {},
  }: ExceptionOptions) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.reason = reason;
    this.errorData = errorData;
  }
}

export function throwError(options: ExceptionOptions): never {
  throw new HttpException(options);
}

export function throwNotFoundError(id?: string | number | object): never {
  throw new HttpException({
    statusCode: 404,
    message: `Nothing was found with id#: ${id}`,
    reason: ErrorReasons.NOT_FOUND,
  });
}
