import express from 'express';
import Joi from 'joi';

import container from '../../container';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type { NextFunction, Request, Response } from '../../extensions/express';
import validate from '../../middleware/validationMiddleware';
import {
  TokenType,
  type ITokenService,
  type RefreshToken,
} from '../../services/tokenService';
import CredentialsByClientIdQuery from '../../users/credentials/queries/credentialsByClientIdQuery';

type GetTokenPayload = {
  clientId: string;
  clientSecret: string;
};

type RefreshTokenPayload = {
  refreshToken: string;
};

const getTokenPayloadSchema = Joi.object<GetTokenPayload>({
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
});

const refreshTokenPayloadSchema = Joi.object<RefreshTokenPayload>({
  refreshToken: Joi.string().required(),
});

const oauthRoutes = express.Router();

oauthRoutes.post('/tokens', validate(getTokenPayloadSchema), getToken);
oauthRoutes.put('/tokens', validate(refreshTokenPayloadSchema), refreshToken);

async function getToken(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenService = container.resolve<ITokenService>('TokenService');
    const { clientId, clientSecret } = req.body as GetTokenPayload;

    const credentials = await new CredentialsByClientIdQuery({
      clientId,
      relations: ['user'],
    }).execute();
    if (!credentials) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const credentialsUser = await credentials.user;
    if (credentialsUser.isDisabled) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const credentialsValid =
      await credentials.validateClientSecret(clientSecret);
    if (!credentialsValid) {
      return res.sendStatus(401);
    }

    const [accessToken, accessTokenExpiresAt] =
      tokenService.createAccessToken(clientId);

    const [refreshToken, refreshTokenExpiresAt] =
      tokenService.createRefreshToken(clientId);

    res.json({
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenService = container.resolve<ITokenService>('TokenService');
    const { refreshToken } = req.body as RefreshTokenPayload;

    const payload = tokenService.verify<RefreshToken>(
      refreshToken,
      TokenType.REFRESH,
    );
    if (payload.type !== 'refresh') {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid token');
    }

    const credentials = await new CredentialsByClientIdQuery({
      clientId: payload.clientId,
      relations: ['user'],
    }).execute();
    if (!credentials) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const credentialsUser = await credentials.user;
    if (credentialsUser.isDisabled) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const [accessToken, accessTokenExpiresAt] = tokenService.createAccessToken(
      payload.clientId,
    );

    const [newRefreshToken, refreshTokenExpiresAt] =
      tokenService.createRefreshToken(payload.clientId);

    res.json({
      accessToken,
      accessTokenExpiresAt,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt,
    });
  } catch (error) {
    next(error);
  }
}

export default oauthRoutes;
