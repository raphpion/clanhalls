import express from 'express';
import Joi from 'joi';

import CreateMembersListReportCommand from '../../../clans/reports/commands/createMembersListReportCommand';
import type { MemberActivity } from '../../../clans/reports/memberActivityReport';
import type { ListMember } from '../../../clans/reports/membersListReport';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../extensions/express';
import { requireCredentials } from '../../../middleware/authMiddleware';
import type { CredentialsPayload } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';
import { normalizePlayerName } from '../../../players/playerUtils';
import UpdateCredentialsCommand from '../../../users/credentials/commands/updateCredentialsCommand';
import { Scopes } from '../../../users/credentials/credentials';

type SendMembersListReportPayload = Partial<CredentialsPayload> & {
  members: ListMember[];
};

const sendMembersListReportPayloadSchema =
  Joi.object<SendMembersListReportPayload>({
    clientId: Joi.string().optional(),
    clientSecret: Joi.string().optional(),
    members: Joi.array()
      .items(
        Joi.object<MemberActivity>({
          name: Joi.string().required(),
          rank: Joi.number().min(-1).max(127).required(),
        }),
      )
      .required(),
  });

const routes = express.Router();

routes.post(
  '/',
  requireCredentials(
    [Scopes.CLAN_REPORTING],
    ['user', 'user.clanUser', 'user.clanUser.clan'],
  ),
  validate(sendMembersListReportPayloadSchema),
  sendMembersListReport,
);

async function sendMembersListReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.credentialsEntity || !req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clanUser = await req.userEntity.clanUser;
    const clan = await clanUser?.clan;
    if (!clan) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is not in a clan. You must create or join it on the website.',
      );
    }

    const { members } = req.body as SendMembersListReportPayload;

    const membersNormalized = members.map((member) => ({
      ...member,
      name: normalizePlayerName(member.name),
    }));

    const report = await new CreateMembersListReportCommand({
      user: req.userEntity,
      clan,
      members: membersNormalized,
    }).execute();

    await new UpdateCredentialsCommand({
      clientId: req.credentialsEntity.clientId,
      updates: { lastUsedAt: new Date() },
    }).execute();

    res.status(201).json({ uuid: report.uuid });
  } catch (error) {
    next(error);
  }
}

export default routes;
