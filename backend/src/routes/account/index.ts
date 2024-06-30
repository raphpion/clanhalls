import express from 'express';

import type { IGoogleService } from '../../account/googleService';
import type { SignInWithGooglePayload } from '../../account/schemas';
import { signInWithGoogleSchema } from '../../account/schemas';
import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { Request, Response, NextFunction } from '../../extensions/express';
import { retrieveAuth } from '../../middlewares/authMiddleware';
import validate from '../../middlewares/validationMiddleware';
import type { ISessionService } from '../../sessions/sessionService';
import type { IUserService } from '../../users/userService';

const googleService = container.resolve<IGoogleService>('GoogleService');
const sessionService = container.resolve<ISessionService>('SessionService');
const userService = container.resolve<IUserService>('UserService');

const accountRoutes = express.Router();

accountRoutes.get('/', retrieveAuth(), getCurrentUser);

accountRoutes.post(
  '/sign-in-with-google',
  validate(signInWithGoogleSchema),
  signInWithGoogle,
  createSessionForUser
);

accountRoutes.post('/sign-out', retrieveAuth(), signOut);

async function createSessionForUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      return res.json(null);
    }

    const { googleId, username, email, emailNormalized, emailVerified } =
      req.userEntity;

    res.json({
      googleId,
      username,
      email,
      emailNormalized,
      emailVerified,
    });
  } catch (error) {
    next(error);
  }
}

async function signInWithGoogle(req: Request, _: Response, next: NextFunction) {
  try {
    const { token } = req.body as SignInWithGooglePayload;
    const payload = await googleService.verifyIdToken(token);
    if (payload === undefined) {
      throw new AppError(
        AppErrorCodes.INVALID_CREDENTIALS,
        'Invalid credentials'
      );
    }

    const { sub: googleId, email, email_verified: emailVerified } = payload;

    let user = await userService.getUserByGoogleId(googleId);
    if (user === null) {
      user = await userService.createUser(googleId, email, true);
    }

    if (emailVerified && !user.emailVerified) {
      await userService.verifyEmail(user);
    }

    req.persist = true;
    req.userEntity = user;

    next();
  } catch (error) {
    next(error);
  }
}

async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.sessionEntity) {
      await sessionService.signOutSession(req.sessionEntity);
    }

    req.session.destroy(console.error);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default accountRoutes;
