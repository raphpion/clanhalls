import express from 'express';
import Joi from 'joi';

import playersRoutes from './players';
import CreateClanForUserCommand from '../../../clans/commands/createClanForUserCommand';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';

type CreateClanPayload = {
  name: string;
};

const createClanSchema = Joi.object<CreateClanPayload>({
  // TODO: add name restrictions
  name: Joi.string().required(),
});

const clanRoutes = express.Router();

clanRoutes.use('/players', playersRoutes);

clanRoutes.get('/', requireAuth(['clanUser', 'clanUser.clan']), getClan);

clanRoutes.post(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  validate(createClanSchema),
  createClan
);

async function createClan(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body as CreateClanPayload;

    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (await req.userEntity.clanUser) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is already in a clan'
      );
    }

    await new CreateClanForUserCommand({
      user: req.userEntity,
      name,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function getClan(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clanUser = await req.userEntity.clanUser;
    const clan = await clanUser?.clan;

    if (!clanUser || !clan) {
      res.json(null);
    }

    res.json({
      name: clan.name,
      uuid: clan.uuid,
      isAdmin: clanUser.isAdmin,
    });
  } catch (error) {
    next(error);
  }
}

export default clanRoutes;
