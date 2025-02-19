import express from 'express';

import DisableClanInvitationCommand from '../../../../clans/commands/disableClanInvitationCommand';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';

const invitationsUuidRoutes = express.Router({ mergeParams: true });

invitationsUuidRoutes.post(
  '/disable',
  requireAuth(['clanUser', 'clanUser.clan']),
  disableInvitation,
);

async function disableInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { uuid } = req.params;

    await new DisableClanInvitationCommand({
      user: req.userEntity,
      uuid,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default invitationsUuidRoutes;
