import express from 'express';

import { createSessionForUser } from '.';
import type { IGoogleService } from '../../account/googleService';
import {
  signInWithGoogleSchema,
  type SignInWithGooglePayload,
} from '../../account/schemas';
import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { Request, Response, NextFunction } from '../../extensions/express';
import validate from '../../middleware/validationMiddleware';
import type { IUserService } from '../../users/userService';

const routes = express.Router();

routes.post(
  '/sign-in-with-google',
  validate(signInWithGoogleSchema),
  signInWithGoogle,
  createSessionForUser
);

async function signInWithGoogle(req: Request, _: Response, next: NextFunction) {
  try {
    const googleService = container.resolve<IGoogleService>('GoogleService');
    const userService = container.resolve<IUserService>('UserService');

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

export default routes;
