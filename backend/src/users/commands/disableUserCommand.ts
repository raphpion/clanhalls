import Command from '../../command';
import User from '../user';

type Params = {
  googleId: string;
};

type Result = User;

class DisableUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);
    const { googleId } = this.params;

    const user = await repository.findOne({
      where: { googleId },
    });

    user.disable();

    return repository.save(user);
  }
}

export default DisableUserCommand;
