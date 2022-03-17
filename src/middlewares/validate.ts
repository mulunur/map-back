import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Response } from 'express';
import BaseRequest from '../modules/base/base.request';
import { throwError } from '../utils/http-exception';

export const dtoValidator =
  (type: any, skipMissingProperties = false) =>
  async (req: BaseRequest, _: Response, next: NextFunction) => {
    const dtoObj = plainToClass(type, req.body);
    const errors = await validate(dtoObj, { skipMissingProperties });
    if (errors.length > 0) {
      const dtoErrors = validateErrors(errors);
      throwError({
        statusCode: 400,
        message: dtoErrors,
      });
    } else {
      req.body = dtoObj;
      next();
    }
  };

function validateErrors(errors: ValidationError[]): string {
  return errors
    .map((error: ValidationError) => {
      if (error.children && error.children.length > 0) {
        return validateErrors(error.children);
      } else {
        return (Object as any).values(error.constraints);
      }
    })
    .join(', ');
}
