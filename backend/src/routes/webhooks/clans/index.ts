import express from 'express';

import memberActivityReportRoutes from './member-activity-report';
import membersListReportRoutes from './members-list-report';
import settingsReportRoutes from './settings-report';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireCredentials } from '../../../middleware/authMiddleware';
import { Scopes } from '../../../users/credentials/credentials';

const clansRoutes = express.Router();

clansRoutes.use('/member-activity-report', memberActivityReportRoutes);
clansRoutes.use('/members-list-report', membersListReportRoutes);
clansRoutes.use('/settings-report', settingsReportRoutes);

clansRoutes.get(
  '/',
  requireCredentials(
    [Scopes.CLAN_REPORTING],
    ['user', 'user.clanUser', 'user.clanUser.clan'],
  ),
  getClan,
);

async function getClan(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clanUser = await req.userEntity.clanUser;
    const clan = await clanUser?.clan;

    if (!clanUser || !clan) {
      return res.json(null);
    }

    res.json({
      uuid: clan.uuid,
      name: clan.name,
      nameInGame: clan.nameInGame,
      lastSyncedAt: clan.lastSyncedAt,
      isAdmin: clanUser.isAdmin,
    });
  } catch (error) {
    next(error);
  }
}

export default clansRoutes;
