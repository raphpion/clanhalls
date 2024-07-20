import Command from '../../command';
import db from '../../db';
import type User from '../../users/user';
import Session from '../session';

type Params = {
  user: User;
  sessionId: string;
  userAgent: string;
  method: string;
  ip: string;
};

type Result = Session;

class CreateSessionForUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(Session);

    const { user, sessionId, userAgent, method, ip } = this.params;

    const session = new Session();
    session.user = Promise.resolve(user);
    session.sessionID = sessionId;
    session.userAgent = userAgent;
    session.method = method;
    session.ipAddress = ip;

    return repository.save(session);
  }
}

export default CreateSessionForUserCommand;
