import Command from '../../command';
import User from '../../users/user';
import Session from '../session';

type Params = {
  googleId: string;
};

class RevokeAllSessionsForUserCommand extends Command<Params> {
  async execute() {
    const sessionRepository = this.db.getRepository(Session);
    const userRepository = this.db.getRepository(User);

    const { googleId } = this.params;
    const user = await userRepository.findOneBy({ googleId });

    const sessions = await user.sessions;
    for (const session of sessions) {
      if (session.isSignedOut) continue;
      session.signOut();
    }

    await sessionRepository.save(sessions);
  }
}

export default RevokeAllSessionsForUserCommand;
