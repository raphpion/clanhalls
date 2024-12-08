import Command from '../../command';
import User from '../user';

type Params = {
  googleId: string;
};

type Result = User;

class EnableUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);
    const { googleId } = this.params;

    const user = await repository.findOne({
      where: { googleId },
    });

    user.enable();

    return repository.save(user);
  }
}

export default EnableUserCommand;
