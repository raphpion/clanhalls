import express from 'express';

import setUsername from './set-username';
import signInWithGoogle from './sign-in-with-google';
import signOut from './sign-out';
import verifyUsernameAvailability from './verify-username-availability';
import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { Request, Response, NextFunction } from '../../extensions/express';
import { retrieveAuth } from '../../middleware/authMiddleware';
import type { ISessionService } from '../../sessions/sessionService';

const accountRoutes = express.Router();

accountRoutes.get(
  '/',
  retrieveAuth(['clanUser', 'clanUser.clan']),
  getCurrentUser
);

accountRoutes.use(
  setUsername,
  signInWithGoogle,
  signOut,
  verifyUsernameAvailability
);

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      return res.json(null);
    }

    const { googleId, username, email, emailNormalized, emailVerified } =
      req.userEntity;

    const clanUser = await req.userEntity.clanUser;
    const clan = await clanUser?.clan;

    res.json({
      googleId,
      username,
      email,
      emailNormalized,
      emailVerified,
      clan: clan
        ? { uuid: clan.uuid, name: clan.name, isAdmin: clanUser.isAdmin }
        : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSessionForUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionService = container.resolve<ISessionService>('SessionService');

    const { headers, ip, persist, session, userEntity } = req;
    if (!userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    // TODO: change "google" to auth method when there are more available
    const sessionEntity = await sessionService.createSessionForUser(
      userEntity,
      session.id,
      headers['user-agent'],
      'google',
      ip
    );

    if (session.uuid) {
      const prevSession = await sessionService.getSessionByUuid(session.uuid);

      await sessionService.signOutSession(prevSession);
    }

    if (!persist) {
      session.cookie.expires = null;
    }

    session.uuid = sessionEntity.uuid;

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export default accountRoutes;
