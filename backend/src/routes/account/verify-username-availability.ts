import express from 'express';
import Joi from 'joi';

import container from '../../container';
import type { Request, Response, NextFunction } from '../../extensions/express';
import { requireAuth } from '../../middleware/authMiddleware';
import validate, {
  ValidationType,
} from '../../middleware/validationMiddleware';
import type { IUserService } from '../../users/userService';

type VerifyUsernameAvailabilityPayload = {
  username: string;
};

const verifyUsernameAvailabilitySchema =
  Joi.object<VerifyUsernameAvailabilityPayload>({
    // TODO: add username restrictions
    username: Joi.string().required(),
  });

const routes = express.Router();

routes.get(
  '/verify-username-availability',
  requireAuth(),
  validate(verifyUsernameAvailabilitySchema, ValidationType.QUERY),
  verifyUsernameAvailability
);

async function verifyUsernameAvailability(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userService = container.resolve<IUserService>('UserService');

    const { username } = req.query as VerifyUsernameAvailabilityPayload;

    const user = await userService.getUserByUsername(username);
    res.json({ available: user === null });
  } catch (error) {
    next(error);
  }
}

export default routes;
