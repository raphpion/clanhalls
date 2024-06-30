import AppError, { isAppError } from '../extensions/errors';
import type { NextFunction, Request, Response } from '../extensions/express';

export default function handleError(
  err: unknown,
  req: Request,
  res: Response,
  _: NextFunction
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `${new Date().toUTCString()} ${req.method} ${req.originalUrl}`,
      req.body,
      err
    );
  }

  if (!isAppError(err)) {
    return res.status(500).json('Internal server error');
  }

  return res
    .status(AppError.codeHttpStatusMap[err.code])
    .json({ code: err.code, message: err.message });
}
