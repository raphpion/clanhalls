export enum AppErrorCodes {
  ALREADY_EXISTS = 'already-exists',
  BAD_REQUEST = 'bad-request',
  INVALID_CONTENT_TYPE = 'invalid-content-type',
  INVALID_CREDENTIALS = 'invalid-credentials',
  INVALID_PARAMETER = 'invalid-parameter',
  NOT_FOUND = 'not-found',
  PERMISSION_DENIED = 'permission-denied',
  UNAUTHORIZED = 'unauthorized',
}

class AppError extends Error {
  public static readonly codeHttpStatusMap: {
    [key in AppErrorCodes]: number;
  } = {
    'already-exists': 409,
    'bad-request': 400,
    'invalid-content-type': 415,
    'invalid-credentials': 401,
    'invalid-parameter': 400,
    'permission-denied': 403,
    'not-found': 404,
    unauthorized: 401,
  };

  public name: string = 'AppError';
  public code: AppErrorCodes;

  public constructor(code: AppErrorCodes, message: string) {
    super(message);
    this.code = code;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export default AppError;
