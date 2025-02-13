import express from 'express';
import Joi from 'joi';

import CreateSettingsReportCommand from '../../../clans/reports/commands/createSettingsReportCommand';
import type { Settings } from '../../../clans/reports/settingsReport';
import CLAN_TITLES from '../../../clans/titles';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../extensions/express';
import { requireCredentials } from '../../../middleware/authMiddleware';
import type { CredentialsPayload } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';
import UpdateCredentialsCommand from '../../../users/credentials/commands/updateCredentialsCommand';
import { Scopes } from '../../../users/credentials/credentials';

type SendSettingsReportPayload = Partial<CredentialsPayload> &
  (Settings | { settings: Settings });

const sendSettingsReportPayload = Joi.object<SendSettingsReportPayload>({
  clientId: Joi.string().optional(),
  clientSecret: Joi.string().optional(),
  settings: Joi.object({
    name: Joi.string().required(),
    ranks: Joi.array()
      .items(
        Joi.object({
          rank: Joi.number().min(-1).max(127).required(),
          title: Joi.string()
            .required()
            .allow(...Object.values(CLAN_TITLES)),
        }),
      )
      .required(),
  }).required(),
  name: Joi.string().optional(),
  ranks: Joi.array()
    .items(
      Joi.object({
        rank: Joi.number().min(-1).max(127).required(),
        title: Joi.string()
          .required()
          .allow(...Object.values(CLAN_TITLES)),
      }),
    )
    .optional(),
});

const routes = express.Router();

routes.post(
  '/',
  requireCredentials(
    [Scopes.CLAN_REPORTING],
    ['user', 'user.clanUser', 'user.clanUser.clan'],
  ),
  validate(sendSettingsReportPayload),
  sendSettingsReport,
);

async function sendSettingsReport(
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

    const payload = req.body as SendSettingsReportPayload;

    const report = await new CreateSettingsReportCommand({
      user: req.userEntity,
      clan,
      settings:
        'settings' in payload
          ? payload.settings
          : { name: payload.name, ranks: payload.ranks },
    }).execute();

    await new UpdateCredentialsCommand({
      clientId: req.credentialsEntity.clientId,
      updates: { lastUsedAt: new Date() },
    }).execute();

    res.status(201).send({ uuid: report.uuid });
  } catch (error) {
    next(error);
  }
}

export default routes;
