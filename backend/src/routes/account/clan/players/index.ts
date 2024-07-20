import express from 'express';

import ClanPlayersQuery, {
  type Params as ClanPlayersQueryParams,
} from '../../../../clans/queries/clanPlayersQuery';
import db from '../../../../db';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';
import User from '../../../../users/user';

const playersRoutes = express.Router();

playersRoutes.get(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  getClanPlayers
);

export async function getClanPlayers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    req.userEntity = await db.getRepository(User).findOne({ where: { id: 1 } });

    const clanUser = await req.userEntity.clanUser;
    if (!clanUser) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not in a clan');
    }

    const clan = await clanUser.clan;

    const { ipp, page, sort, order, search } = req.query;

    const data = await new ClanPlayersQuery({
      clan,
      ipp: ipp ? Number(ipp) : 50,
      page: page ? Number(page) : 1,
      search: search as string,
      orderBy: {
        field: (sort || 'rank') as ClanPlayersQueryParams['orderBy']['field'],
        order: (order || 'ASC') as ClanPlayersQueryParams['orderBy']['order'],
      },
      withTotalCount: true,
    }).execute();

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default playersRoutes;
