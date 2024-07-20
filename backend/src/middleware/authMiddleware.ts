import Joi from 'joi';

import AppError, { AppErrorCodes } from '../extensions/errors';
import type { NextFunction, Request, Response } from '../extensions/express';
import SessionByUuidQuery from '../sessions/queries/sessionByUuidQuery';
import type { Scopes } from '../users/credentials/credentials';
import CredentialsByClientIdQuery from '../users/credentials/queries/credentialsByClientIdQuery';

export type CredentialsPayload = {
  clientId: string;
  clientSecret: string;
};

export const credentialsPayloadSchema = Joi.object<CredentialsPayload>({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

export function requireAuth(relations: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
      }

      const sessionRelations = ['user', ...relations.map((r) => `user.${r}`)];

      const session = await new SessionByUuidQuery({
        uuid: req.session.uuid,
        relations: sessionRelations,
      }).execute();

      if (!session || session.signedOutAt) {
        req.session.destroy(console.error);
        return res.sendStatus(401);
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function retrieveAuth(relations: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        return next();
      }

      const sessionRelations = ['user', ...relations.map((r) => `user.${r}`)];

      const session = await new SessionByUuidQuery({
        uuid: req.session.uuid,
        relations: sessionRelations,
      }).execute();
      if (!session || session.isSignedOut) {
        req.session.destroy(console.error);
        return next();
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireCredentials(scope: Scopes[], relations: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, clientSecret } = req.body as CredentialsPayload;
      if (!clientId || !clientSecret) {
        return res.sendStatus(401);
      }

      const credentials = await new CredentialsByClientIdQuery({
        clientId,
        relations,
      }).execute();
      if (!credentials) {
        return res.sendStatus(401);
      }

      const credentialsValid = await credentials.validateClientSecret(
        clientSecret
      );
      if (!credentialsValid) {
        return res.sendStatus(401);
      }

      const scopeValid = credentials.validateScope(scope);
      if (!scopeValid) {
        res.status(401).send('Credentials do not have the required scope');
      }

      req.credentialsEntity = credentials;
      req.userEntity = await credentials.user;
      next();
    } catch (error) {
      next(error);
    }
  };
}
