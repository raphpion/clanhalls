import type { ObjectSchema } from 'joi';

import AppError, { AppErrorCodes } from '../extensions/errors';
import type { NextFunction, Request, Response } from '../extensions/express';

export enum ValidationType {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}

function validate(
  schema: ObjectSchema,
  type: ValidationType = ValidationType.BODY
) {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const data = req[type];
      const { error } = schema.validate(data);

      if (error) {
        throw new AppError(AppErrorCodes.INVALID_PARAMETER, error.message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validate;
