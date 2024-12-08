import express from 'express';
import Joi from 'joi';

import { createSessionForUser } from '.';
import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { Request, Response, NextFunction } from '../../extensions/express';
import validate from '../../middleware/validationMiddleware';
import type { IGoogleService } from '../../services/googleService';
import SignUpUserCommand from '../../users/commands/signUpUserCommand';
import UpdateUserCommand from '../../users/commands/updateUserCommand';
import UserByGoogleIdQuery from '../../users/queries/userByGoogleIdQuery';

type SignInWithGooglePayload = {
  token: string;
};

const signInWithGoogleSchema = Joi.object<SignInWithGooglePayload>({
  token: Joi.string().required(),
});

const routes = express.Router();

routes.post(
  '/sign-in-with-google',
  validate(signInWithGoogleSchema),
  signInWithGoogle,
  createSessionForUser,
);

async function signInWithGoogle(req: Request, _: Response, next: NextFunction) {
  try {
    const googleService = container.resolve<IGoogleService>('GoogleService');

    const { token } = req.body as SignInWithGooglePayload;
    const payload = await googleService.verifyIdToken(token);
    if (payload === undefined) {
      throw new AppError(
        AppErrorCodes.INVALID_CREDENTIALS,
        'Invalid credentials',
      );
    }

    const {
      sub: googleId,
      email,
      email_verified: emailVerified,
      picture: pictureUrl,
    } = payload;

    let user = await new UserByGoogleIdQuery({ googleId }).execute();
    if (user === null) {
      user = await new SignUpUserCommand({
        googleId,
        email,
        emailVerified,
        pictureUrl,
      }).execute();
    } else if (user.isDisabled) {
      throw new AppError(AppErrorCodes.PERMISSION_DENIED, 'Account disabled');
    }

    const updates = {
      ...(emailVerified && !user.emailVerified && { emailVerified }),
      ...(pictureUrl !== user.pictureUrl && { pictureUrl }),
    };

    if (Object.keys(updates).length > 0) {
      user = await new UpdateUserCommand({ user, updates }).execute();
    }

    req.persist = true;
    req.userEntity = user;

    next();
  } catch (error) {
    next(error);
  }
}

export default routes;
