import express from 'express';
import Joi from 'joi';

import type { ICredentialsService } from '../../../account/credentialsService';
import container from '../../../container';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';

type CreateCredentialsPayload = {
  name: string;
  scope: string;
};

const createCredentialsSchema = Joi.object<CreateCredentialsPayload>({
  // TODO: add name restrictions
  name: Joi.string().required(),
  // TODO: add scope restrictions
  scope: Joi.string().required(),
});

const credentialsRoutes = express.Router();

credentialsRoutes.get('/', requireAuth(['credentials']), getCredentials);

credentialsRoutes.post(
  '/',
  requireAuth(),
  validate(createCredentialsSchema),
  createCredentials
);

async function getCredentials(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const credentials = (await req.userEntity.credentials).map((c) => ({
      name: c.name,
      scope: c.scope,
      clientId: c.clientId,
      createdAt: c.createdAt,
      lastUsedAt: c.lastUsedAt,
    }));

    res.json(credentials);
  } catch (error) {
    next(error);
  }
}

async function createCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const credentialsService =
      container.resolve<ICredentialsService>('CredentialsService');

    const { name, scope } = req.body as CreateCredentialsPayload;

    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const [credentials, clientSecret] =
      await credentialsService.createCredentialsForUser(
        req.userEntity,
        name,
        scope
      );

    res.json({ clientId: credentials.clientId, clientSecret });
  } catch (error) {
    next(error);
  }
}

export default credentialsRoutes;
