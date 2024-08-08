import express from 'express';
import Joi from 'joi';

import ClanNameAvailabilityQuery from '../../../clans/queries/clanNameAvailabilityQuery';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import validate, {
  ValidationType,
} from '../../../middleware/validationMiddleware';

type VerifyClanNameAvailabilityPayload = {
  name: string;
};

const verifyClanNameAvailabilitySchema =
  Joi.object<VerifyClanNameAvailabilityPayload>({
    // TODO: add username restrictions
    name: Joi.string().required(),
  });

const routes = express.Router();

routes.get(
  '/',
  requireAuth(),
  validate(verifyClanNameAvailabilitySchema, ValidationType.QUERY),
  verifyClanNameAvailability,
);

async function verifyClanNameAvailability(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.query as VerifyClanNameAvailabilityPayload;

    const available = await new ClanNameAvailabilityQuery({
      name,
    }).execute();

    res.json({ available });
  } catch (error) {
    next(error);
  }
}

export default routes;
