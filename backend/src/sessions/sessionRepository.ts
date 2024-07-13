import { injectable } from 'tsyringe';

import Session from './session';
import db from '../db';

export interface ISessionRepository {
  getSessionByUuid(uuid: string, relations?: string[]): Promise<Session | null>;
  saveSession(session: Session): Promise<Session>;
}

@injectable()
export default class SessionRepository implements ISessionRepository {
  private readonly sessionRepository = db.getRepository(Session);

  public async getSessionByUuid(uuid: string, relations: string[] = []) {
    return this.sessionRepository.findOne({ where: { uuid }, relations });
  }

  public async saveSession(session: Session) {
    await this.sessionRepository.save(session);
    return session;
  }
}
