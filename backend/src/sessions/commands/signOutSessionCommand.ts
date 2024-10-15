
import Command from '../../command';
import Session from '../session';

type Params = {
  session: Session;
};

type Result = Session;

class SignOutSessionCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(Session);

    const { session } = this.params;

    session.signOut();
    const savedSession = await repository.save(session);

    return savedSession;
  }
}

export default SignOutSessionCommand;
