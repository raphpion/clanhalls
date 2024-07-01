import express from 'express';
import Joi from 'joi';

import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { NextFunction, Request, Response } from '../../extensions/express';
import { requireAuth } from '../../middleware/authMiddleware';
import validate from '../../middleware/validationMiddleware';
import type { IUserService } from '../../users/userService';

type SetUsernamePayload = {
  username: string;
};

const setUsernameSchema = Joi.object<SetUsernamePayload>({
  // TODO: add username restrictions
  username: Joi.string().required(),
});

const routes = express.Router();

routes.post(
  '/set-username',
  requireAuth(),
  validate(setUsernameSchema),
  setUsername
);

async function setUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const userService = container.resolve<IUserService>('UserService');

    const { username } = req.body as SetUsernamePayload;

    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    await userService.setUsername(req.userEntity, username);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default routes;
