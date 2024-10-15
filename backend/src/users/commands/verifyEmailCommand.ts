import Command from '../../command';
import User from '../user';

type Params = {
  user: User;
};

type Result = User;

class VerifyEmailCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);

    const { user } = this.params;
    user.verifyEmail();

    return repository.save(user);
  }
}

export default VerifyEmailCommand;
