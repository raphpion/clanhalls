import express from 'express';

import AcceptClanInvitationCommand from '../../../../clans/commands/acceptClanInvitationCommand';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';

const acceptInvitationsRoutes = express.Router();

acceptInvitationsRoutes.post(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  acceptInvitation,
);

async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const code = req.query.code.toString();
    if (!code) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'Code is required');
    }

    const clanUser = await req.userEntity.clanUser;
    if (clanUser) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is already in a clan',
      );
    }

    await new AcceptClanInvitationCommand({
      user: req.userEntity,
      code,
    }).execute();

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export default acceptInvitationsRoutes;
