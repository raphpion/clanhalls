import { inject, injectable } from 'tsyringe';

import type { SessionRelations } from './session';
import Session from './session';
import type { ISessionRepository } from './sessionRepository';
import type User from '../users/user';

export interface ISessionService {
  createSessionForUser(
    user: User,
    sessionId: string,
    userAgent: string,
    method: string,
    ip: string
  ): Promise<Session>;

  getSessionByUuid(
    uuid: string,
    relations?: SessionRelations[]
  ): Promise<Session | null>;

  signOutSession(session: Session): Promise<void>;
}

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject('SessionRepository')
    private readonly sessionRepository: ISessionRepository
  ) {}

  public async createSessionForUser(
    user: User,
    sessionId: string,
    userAgent: string,
    method: string,
    ip: string
  ) {
    const session = new Session();
    session.user = Promise.resolve(user);
    session.sessionID = sessionId;
    session.userAgent = userAgent;
    session.method = method;
    session.ipAddress = ip;

    return this.sessionRepository.saveSession(session);
  }

  public async getSessionByUuid(
    uuid: string,
    relations: SessionRelations[] = []
  ) {
    return this.sessionRepository.getSessionByUuid(uuid, relations);
  }

  public async signOutSession(session: Session) {
    session.signOut();
    await this.sessionRepository.saveSession(session);
  }
}

export default SessionService;
