import Command from '../../command';
import db from '../../db';
import Session from '../session';

type Params = {
  session: Session;
};

type Result = Session;

class SignOutSessionCommand extends Command<Params, Result> {
  async execute() {
    const { session } = this.params;
    const repository = db.getRepository(Session);

    session.signOut();
    const savedSession = await repository.save(session);

    return savedSession;
  }
}

export default SignOutSessionCommand;
