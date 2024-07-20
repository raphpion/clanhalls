import type { ObjectSchema } from 'joi';

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
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[type];
    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).json({
        errors: error.details.map((e) => ({
          message: e.message,
          source: e.path.join('.'),
        })),
      });
    }

    next();
  };
}

export default validate;
