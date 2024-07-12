import express from 'express';
import Joi from 'joi';

import type { IClanService } from '../../clans/clanService';
import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { NextFunction, Request, Response } from '../../extensions/express';
import { requireAuth } from '../../middleware/authMiddleware';
import validate from '../../middleware/validationMiddleware';

type CreateClanPayload = {
  name: string;
};

const createClanSchema = Joi.object<CreateClanPayload>({
  // TODO: add name restrictions
  name: Joi.string().required(),
});

const routes = express.Router();

routes.post(
  '/create-clan',
  requireAuth(['clanUser']),
  validate(createClanSchema),
  createClan
);

async function createClan(req: Request, res: Response, next: NextFunction) {
  try {
    const clanService = container.resolve<IClanService>('ClanService');

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

    await clanService.createClanForUser(name, req.userEntity);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default routes;
