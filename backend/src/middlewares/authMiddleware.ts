import container from '../container';
import type { NextFunction, Request, Response } from '../extensions/express';
import type { SessionRelations } from '../sessions/session';
import type { ISessionService } from '../sessions/sessionService';
import type { UserRelations } from '../users/user';

export function requireAuth(relations: UserRelations[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        return res.sendStatus(401);
      }

      const sessionRelations = [
        'user',
        ...relations.map((r) => `user.${r}`),
      ] as SessionRelations[];

      const sessionService =
        container.resolve<ISessionService>('SessionService');

      const session = await sessionService.getSessionByUuid(
        req.session.uuid,
        sessionRelations
      );

      if (!session || session.signedOutAt) {
        req.session.destroy(console.error);
        return res.sendStatus(401);
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function retrieveAuth(relations: UserRelations[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        return next();
      }

      const sessionRelations = [
        'user',
        ...relations.map((r) => `user.${r}`),
      ] as SessionRelations[];

      const sessionService =
        container.resolve<ISessionService>('SessionService');

      const session = await sessionService.getSessionByUuid(
        req.session.uuid,
        sessionRelations
      );
      if (!session || session.isSignedOut) {
        req.session.destroy(console.error);
        return next();
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      next();
    } catch (error) {
      next(error);
    }
  };
}
