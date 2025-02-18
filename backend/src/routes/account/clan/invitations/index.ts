import express from 'express';
import Joi from 'joi';

import CreateClanInvitationCommand from '../../../../clans/commands/createClanInvitationCommand';
import ClanInvitationsQuery, {
  type Params as ClanInvitationsQueryParams,
} from '../../../../clans/queries/clanInvitationsQuery';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';
import validate, {
  ValidationType,
} from '../../../../middleware/validationMiddleware';

type QueryInvitationsPayload = {
  ipp: number;
  page: number;
  sort: ClanInvitationsQueryParams['orderBy']['field'];
  order: ClanInvitationsQueryParams['orderBy']['order'];
  search: string;
  expired?: boolean;
  disabled?: boolean;
};

type CreateInvitationPayload = {
  description: string | null;
  expiresAt: number | null;
  maxUses: number | null;
};

const createInvitationSchema = Joi.object<CreateInvitationPayload>({
  description: Joi.string().allow(null),
  expiresAt: Joi.number().allow(null),
  maxUses: Joi.number().allow(null),
});

const invitationsRoutes = express.Router();

invitationsRoutes.get(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  queryInvitations,
);

invitationsRoutes.post(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  validate(createInvitationSchema, ValidationType.QUERY),
  createInvitation,
);

async function queryInvitations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clanUser = await req.userEntity.clanUser;
    const clan = await clanUser?.clan;
    if (!clan) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not in a clan');
    }

    const { ipp, page, sort, order, search, expired, disabled } = req.query;

    const data = await new ClanInvitationsQuery({
      clan,
      ipp: ipp ? Number(ipp) : 50,
      page: page ? Number(page) : 1,
      search: search as string,
      orderBy: {
        field: (sort ||
          'expiresAt') as ClanInvitationsQueryParams['orderBy']['field'],
        order: (order ||
          'ASC') as ClanInvitationsQueryParams['orderBy']['order'],
      },
      expired: expired === 'true',
      disabled: disabled === 'true',
      withTotalCount: true,
    }).execute();

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function createInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { description, expiresAt, maxUses } =
      req.body as CreateInvitationPayload;

    await new CreateClanInvitationCommand({
      user: req.userEntity,
      description,
      expiresAt: new Date(expiresAt),
      maxUses,
    }).execute();

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export default invitationsRoutes;
