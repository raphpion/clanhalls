import express from 'express';

import type { Rank } from '../../../../clans/ranks';
import CLAN_RANKS from '../../../../clans/ranks';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';

const playersRoutes = express.Router();

playersRoutes.get(
  '/',
  requireAuth([
    'clanUser',
    'clanUser.clan',
    'clanUser.clan.clanPlayers',
    'clanUser.clan.clanPlayers.player',
  ]),
  getClanPlayers
);

// TODO: add pagination and query params
export async function getClanPlayers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clanUser = await req.userEntity.clanUser;
    if (!clanUser) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not in a clan');
    }

    const clan = await clanUser.clan;
    const clanPlayers = await clan.clanPlayers;

    const ignoredRanks = ['GUEST', 'JMOD'];

    const players = await Promise.all(
      clanPlayers
        .sort(
          (a, b) =>
            CLAN_RANKS.indexOf(b.rank as Rank) -
            CLAN_RANKS.indexOf(a.rank as Rank)
        )
        .filter((cp) => !ignoredRanks.includes(cp.rank))
        .map(async (cp) => {
          const player = await cp.player;
          const { rank, lastSeenAt } = cp;
          const { uuid, username } = player;
          return {
            uuid,
            rank, // TODO: rank's title
            username,
            lastSeenAt,
          };
        })
    );

    res.json(players);
  } catch (error) {
    next(error);
  }
}

export default playersRoutes;
