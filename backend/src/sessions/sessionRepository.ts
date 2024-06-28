import { injectable } from 'tsyringe';

import Session, { type SessionRelations } from './session';
import db from '../db';

export interface ISessionRepository {
  getSessionByUuid(
    uuid: string,
    relations?: SessionRelations[]
  ): Promise<Session | null>;
  saveSession(session: Session): Promise<Session>;
}

@injectable()
export default class SessionRepository implements ISessionRepository {
  private readonly sessionRepository = db.getRepository(Session);

  public async getSessionByUuid(
    uuid: string,
    relations: SessionRelations[] = []
  ) {
    return this.sessionRepository.findOne({ where: { uuid }, relations });
  }

  public async saveSession(session: Session) {
    await this.sessionRepository.save(session);
    return session;
  }
}
