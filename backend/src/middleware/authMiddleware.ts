import Joi from 'joi';

import type { CredentialsRelations, Scopes } from '../account/credentials';
import type { ICredentialsService } from '../account/credentialsService';
import container from '../container';
import AppError, { AppErrorCodes } from '../extensions/errors';
import type { NextFunction, Request, Response } from '../extensions/express';
import type { SessionRelations } from '../sessions/session';
import type { ISessionService } from '../sessions/sessionService';
import type { UserRelations } from '../users/user';

export type CredentialsPayload = {
  clientId: string;
  clientSecret: string;
};

export const credentialsPayloadSchema = Joi.object<CredentialsPayload>({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

export function requireAuth(relations: UserRelations[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
      }

      const sessionRelations = [
        'user',
        ...relations.map((r) => `user.${r}`),
      ] as SessionRelations[];

      const sessionService =
        container.resolve<ISessionService>('SessionService');

      const session = await sessionService.getSessionByUuid(
        req.session.uuid,
        sessionRelations
      );

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

export function retrieveAuth(relations: UserRelations[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.session.uuid) {
        return next();
      }

      const sessionRelations = [
        'user',
        ...relations.map((r) => `user.${r}`),
      ] as SessionRelations[];

      const sessionService =
        container.resolve<ISessionService>('SessionService');

      const session = await sessionService.getSessionByUuid(
        req.session.uuid,
        sessionRelations
      );
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

export function requireCredentials(
  scope: Scopes[],
  relations: CredentialsRelations[] = []
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const credentialsService =
        container.resolve<ICredentialsService>('CredentialsService');

      const { clientId, clientSecret } = req.body as CredentialsPayload;
      if (!clientId || !clientSecret) {
        return res.sendStatus(401);
      }

      const credentials = await credentialsService.getCredentialsByClientId(
        clientId,
        relations
      );
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
