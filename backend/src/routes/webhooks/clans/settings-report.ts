import express from 'express';
import Joi from 'joi';

import { Scopes } from '../../../account/credentials';
import type { ICredentialsService } from '../../../account/credentialsService';
import type { IClanService } from '../../../clans/clanService';
import type { Settings } from '../../../clans/reports/settingsReport';
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

type SendSettingsReportPayload = CredentialsPayload & {
  settings: Settings;
};

const sendSettingsReportPayload = Joi.object<SendSettingsReportPayload>({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  settings: Joi.object({
    name: Joi.string().required(),
    ranks: Joi.object().pattern(Joi.string(), Joi.string()).required(),
  }),
});

const routes = express.Router();

routes.post(
  '/',
  requireCredentials(
    [Scopes.CLAN_REPORTING],
    ['user', 'user.clanUser', 'user.clanUser.clan']
  ),
  validate(sendSettingsReportPayload),
  sendSettingsReport
);

async function sendSettingsReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clanService = container.resolve<IClanService>('ClanService');
    const credentialsService =
      container.resolve<ICredentialsService>('CredentialsService');

    if (!req.credentialsEntity || !req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const clan = await req.userEntity.clan;
    if (!clan) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is not in a clan. You must create or join it on the website.'
      );
    }

    const { settings } = req.body as SendSettingsReportPayload;

    await clanService.createSettingsReport(req.userEntity, clan, settings);

    req.credentialsEntity = await credentialsService.updateLastUsedAt(
      req.credentialsEntity
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default routes;
