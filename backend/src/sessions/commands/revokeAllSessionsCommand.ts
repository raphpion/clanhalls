import Command from '../../command';
import db from '../../db';
import type User from '../../users/user';
import Session from '../session';

type Params = {
  user: User;
};

class RevokeAllSessionsCommand extends Command<Params> {
  async execute() {
    const { user } = this.params;
    const repository = db.getRepository(Session);

    const sessions = await user.sessions;
    for (const session of sessions) {
      if (session.isSignedOut) continue;
      session.signOut();
    }

    await repository.save(sessions);
  }
}

export default RevokeAllSessionsCommand;
