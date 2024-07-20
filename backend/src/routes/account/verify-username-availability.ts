import express from 'express';
import Joi from 'joi';

import type { Request, Response, NextFunction } from '../../extensions/express';
import { requireAuth } from '../../middleware/authMiddleware';
import validate, {
  ValidationType,
} from '../../middleware/validationMiddleware';
import UsernameAvailabilityQuery from '../../users/queries/usernameAvailabilityQuery';

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
    const { username } = req.query as VerifyUsernameAvailabilityPayload;

    const available = await new UsernameAvailabilityQuery({
      username,
    }).execute();

    res.json({ available });
  } catch (error) {
    next(error);
  }
}

export default routes;
