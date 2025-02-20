import express from 'express';

import VerifyClanInvitationQuery from '../../../../clans/queries/verifyClanInvitationQuery';
import AppError, { AppErrorCodes } from '../../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../../extensions/express';
import { requireAuth } from '../../../../middleware/authMiddleware';

const verifyInvitationsRoutes = express.Router();

verifyInvitationsRoutes.get(
  '/',
  requireAuth(['clanUser', 'clanUser.clan']),
  verifyInvitation,
);

async function verifyInvitation(
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

    const verificationData = await new VerifyClanInvitationQuery({
      code,
    }).execute();

    res.json(verificationData);
  } catch (error) {
    next(error);
  }
}

export default verifyInvitationsRoutes;
