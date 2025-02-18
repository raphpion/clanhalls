import express from 'express';

import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import RevokeSessionForCommand from '../../../sessions/commands/revokeSessionForUserCommand';

const sessionsUuidRoutes = express.Router({ mergeParams: true });

sessionsUuidRoutes.delete('/', requireAuth(), revokeSession);

async function revokeSession(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { uuid } = req.params;

    await new RevokeSessionForCommand({
      userId: req.userEntity.id,
      uuid,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default sessionsUuidRoutes;
