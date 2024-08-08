import express from 'express';

import clanRoutes from './clan';
import credentialsRoutes from './credentials';
import setUsername from './set-username';
import signInWithGoogle from './sign-in-with-google';
import signOut from './sign-out';
import verifyUsernameAvailability from './verify-username-availability';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { Request, Response, NextFunction } from '../../extensions/express';
import { retrieveAuth } from '../../middleware/authMiddleware';
import CreateSessionForUserCommand from '../../sessions/commands/createSessionForUserCommand';
import SignOutSessionCommand from '../../sessions/commands/signOutSessionCommand';
import SessionByUuidQuery from '../../sessions/queries/sessionByUuidQuery';

const accountRoutes = express.Router();

accountRoutes.get('/', retrieveAuth(['clanUser', 'clanUser.clan']), getSession);

accountRoutes.use(
  setUsername,
  signInWithGoogle,
  signOut,
  verifyUsernameAvailability,
);

accountRoutes.use('/clan', clanRoutes);
accountRoutes.use('/credentials', credentialsRoutes);

async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      return res.json({ user: null, clan: null });
    }

    const {
      googleId,
      username,
      email,
      emailNormalized,
      emailVerified,
      pictureUrl,
    } = req.userEntity;

    const clanUser = await req.userEntity.clanUser;
    const clan = (await clanUser?.clan) || null;

    const clanData = clan
      ? {
          uuid: clan.uuid,
          name: clan.name,
          nameInGame: clan.nameInGame,
          lastSyncedAt: clan.lastSyncedAt,
        }
      : null;

    res.json({
      user: {
        googleId,
        username,
        email,
        emailNormalized,
        emailVerified,
        pictureUrl,
        isClanAdmin: clanUser?.isAdmin || false,
      },
      clan: clanData,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSessionForUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { headers, ip, persist, session, userEntity } = req;
    if (!userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    // TODO: change "google" to auth method when there are more available
    const sessionEntity = await new CreateSessionForUserCommand({
      user: userEntity,
      sessionId: session.id,
      userAgent: headers['user-agent'],
      method: 'google',
      ip,
    }).execute();

    if (session.uuid) {
      const prevSession = await new SessionByUuidQuery({
        uuid: session.uuid,
      }).execute();

      await new SignOutSessionCommand({ session: prevSession }).execute();
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
