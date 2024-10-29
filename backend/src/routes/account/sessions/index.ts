import express from 'express';

import sessionsUuidRoutes from './[uuid]';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import RevokeAllSessionsForUserCommand from '../../../sessions/commands/revokeAllSessionsForUserCommand';

const sessionsRoutes = express.Router();

sessionsRoutes.use('/:uuid', sessionsUuidRoutes);

sessionsRoutes.get('/', requireAuth(['sessions']), getActiveSessions);
sessionsRoutes.delete('/', requireAuth(['sessions']), revokeAllSessions);

async function getActiveSessions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const sessions = (await req.userEntity.sessions)
      .filter((s) => !s.isSignedOut)
      .map((s) => ({
        uuid: s.uuid,
        method: s.method,
        ipAddress: s.ipAddress,
        deviceType: s.deviceType,
        os: s.os,
        browser: s.browser,
        location: s.location,
        lastSeenAt: s.lastSeenAt,
        isCurrent: s.sessionID === req.sessionID,
      }))
      .sort((s) => (s.isCurrent ? -1 : 1));

    res.json(sessions);
  } catch (error) {
    next(error);
  }
}

async function revokeAllSessions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    await new RevokeAllSessionsForUserCommand({
      user: req.userEntity,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default sessionsRoutes;
