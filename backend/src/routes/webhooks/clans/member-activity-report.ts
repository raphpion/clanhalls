import express from 'express';
import Joi from 'joi';

import { Scopes } from '../../../account/credentials';
import type { IClanService } from '../../../clans/clanService';
import type { MemberActivity } from '../../../clans/memberActivityReport';
import container from '../../../container';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../extensions/express';
import { requireCredentials } from '../../../middleware/authMiddleware';
import type { CredentialsPayload } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';

type SendMemberActivityReportPayload = CredentialsPayload & {
  members: MemberActivity[];
};

const sendMemberActivityReportPayloadSchema =
  Joi.object<SendMemberActivityReportPayload>({
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    members: Joi.array()
      .items(
        Joi.object<MemberActivity>({
          name: Joi.string().required(),
          rank: Joi.string().required(),
        })
      )
      .required(),
  });

const routes = express.Router();

routes.post(
  '/',
  requireCredentials(
    [Scopes.CLAN_REPORTING],
    ['user', 'user.clanUser', 'user.clanUser.clan']
  ),
  validate(sendMemberActivityReportPayloadSchema),
  sendMemberActivityReport
);

async function sendMemberActivityReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clanService = container.resolve<IClanService>('ClanService');

    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clan = await req.userEntity.clan;
    if (!clan) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is not in a clan. You must create or join it on the website.'
      );
    }

    const { members } = req.body as SendMemberActivityReportPayload;

    await clanService.createMemberActivityReport(req.userEntity, clan, members);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default routes;
