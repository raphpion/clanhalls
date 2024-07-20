import Command from '../../command';
import db from '../../db';
import User from '../user';

type Params = {
  user: User;
};

type Result = User;

class VerifyEmailCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(User);

    const { user } = this.params;
    user.verifyEmail();

    return repository.save(user);
  }
}

export default VerifyEmailCommand;
