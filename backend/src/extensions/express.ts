import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';
import type { Session as ExpressSession } from 'express-session';

import type SessionEntity from '../sessions/session';
import type User from '../users/user';
export interface Session extends ExpressSession {
  uuid?: string;
}

export interface Request extends ExpressRequest {
  session: Session;
  persist?: boolean;
  userEntity?: User;
  sessionEntity?: SessionEntity;
}

export interface Response extends ExpressResponse {}

export interface NextFunction extends ExpressNextFunction {}
