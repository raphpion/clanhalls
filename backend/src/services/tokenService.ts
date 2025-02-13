import type { JwtPayload } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import type ConfigService from '../config';
import AppError, { AppErrorCodes } from '../extensions/errors';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

type TokenPayload = Pick<JwtPayload, 'exp'> & { type: TokenType };

export type AccessToken = TokenPayload & {
  clientId: string;
};

export type RefreshToken = TokenPayload & {
  clientId: string;
};

export interface ITokenService {
  sign<T extends object>(payload: T): string;
  verify<T extends object>(token: string, type?: TokenType): T;
  createAccessToken(clientId: string): [string, number];
  createRefreshToken(clientId: string): [string, number];
}

@injectable()
class TokenService implements ITokenService {
  private readonly jwtSecret: string;

  constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
  ) {
    this.jwtSecret = configService.get((config) => config.jwtSecret);
  }

  public sign<T extends object>(payload: T): string {
    return sign(payload, this.jwtSecret);
  }

  public verify<T extends object>(token: string, type?: TokenType): T {
    const decoded = verify(token, this.jwtSecret) as JwtPayload;
    if (!decoded || typeof decoded !== 'object') {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid token');
    }

    if (type && decoded.type !== type) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Invalid token');
    }

    return decoded as T;
  }

  public createAccessToken(clientId: string): [string, number] {
    const utcNowSeconds = Math.floor(Date.now() / 1000);
    const exp = utcNowSeconds + 3600;
    const payload: AccessToken = {
      type: TokenType.ACCESS,
      clientId,
      exp,
    };

    const token = this.sign(payload);

    return [token, exp];
  }

  public createRefreshToken(clientId: string): [string, number] {
    const utcNowSeconds = Math.floor(Date.now() / 1000);
    const exp = utcNowSeconds + 3600 * 24 * 7;
    const payload: AccessToken = {
      type: TokenType.REFRESH,
      clientId,
      exp,
    };

    const token = this.sign(payload);

    return [token, exp];
  }
}

export default TokenService;
