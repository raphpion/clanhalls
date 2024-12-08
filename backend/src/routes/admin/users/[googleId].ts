import express from 'express';

import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import RevokeAllSessionsForUserCommand from '../../../sessions/commands/revokeAllSessionsForUserCommand';
import DisableUserCommand from '../../../users/commands/disableUserCommand';
import EnableUserCommand from '../../../users/commands/enableUserCommand';

const adminUsersGoogleIdRoute = express.Router({ mergeParams: true });

adminUsersGoogleIdRoute.post('/disable', disableUser);
adminUsersGoogleIdRoute.post('/enable', enableUser);
adminUsersGoogleIdRoute.post('/sign-out-all', signOutAll);

export async function disableUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { googleId } = req.params;

    await new DisableUserCommand({ googleId }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function enableUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { googleId } = req.params;

    await new EnableUserCommand({ googleId }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function signOutAll(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { googleId } = req.params;
    await new RevokeAllSessionsForUserCommand({ googleId }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default adminUsersGoogleIdRoute;
