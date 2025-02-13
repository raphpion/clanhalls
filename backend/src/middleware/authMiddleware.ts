import Joi from 'joi';

import AppError, { AppErrorCodes } from '../extensions/errors';
import type { NextFunction, Request, Response } from '../extensions/express';
import UpdateSessionLastSeenAtCommand from '../sessions/commands/updateSessionLastSeenAtCommand';
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

      const sessionUser = await session?.user;
      if (sessionUser?.isDisabled) {
        req.session.destroy(console.error);
        return res.sendStatus(403);
      }

      if (!session || session.signedOutAt) {
        req.session.destroy(console.error);
        return res.sendStatus(401);
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      new UpdateSessionLastSeenAtCommand({ uuid: session.uuid }).execute();

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

      const sessionUser = await session?.user;
      if (sessionUser?.isDisabled) {
        req.session.destroy(console.error);
        return res.sendStatus(403);
      }

      if (!session || session.isSignedOut) {
        req.session.destroy(console.error);
        return next();
      }

      req.sessionEntity = session;
      req.userEntity = await session.user;

      new UpdateSessionLastSeenAtCommand({ uuid: session.uuid }).execute();

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireCredentials(scope: Scopes[], relations: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      let clientId: string | undefined;
      let clientSecret: string | undefined;

      if (req.headers.authorization) {
        const authHeader = req.headers.authorization;

        if (authHeader.startsWith('Basic ')) {
          const base64Credentials = authHeader.split(' ')[1];
          const decodedCredentials = Buffer.from(
            base64Credentials,
            'base64',
          ).toString('utf-8');
          [clientId, clientSecret] = decodedCredentials.split(':');
        }
      }

      if (!clientId || !clientSecret) {
        const bodyPayload = req.body as CredentialsPayload | undefined;
        if (bodyPayload) {
          clientId = bodyPayload.clientId;
          clientSecret = bodyPayload.clientSecret;
        }
      }

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

      const credentialsUser = await credentials.user;
      if (credentialsUser.isDisabled) {
        return res.sendStatus(403);
      }

      const credentialsValid =
        await credentials.validateClientSecret(clientSecret);
      if (!credentialsValid) {
        return res.sendStatus(401);
      }

      const scopeValid = credentials.validateScope(scope);
      if (!scopeValid) {
        res.status(401).send('Credentials do not have the required scope');
      }

      req.credentialsEntity = credentials;
      req.userEntity = credentialsUser;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireSuperAdmin(relations: string[] = []) {
  return [
    requireAuth(relations),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        if (!req.userEntity) {
          throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
        }

        if (req.userEntity.isDisabled || !req.userEntity.isSuperAdmin) {
          throw new AppError(AppErrorCodes.PERMISSION_DENIED, 'Forbidden');
        }

        next();
      } catch (error) {
        next(error);
      }
    },
  ];
}
