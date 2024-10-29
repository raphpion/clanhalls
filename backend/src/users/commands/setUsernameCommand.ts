import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import User from '../user';

type Params = {
  user: User;
  username: string;
};

type Result = User;

class SetUsernameCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);
    const { user, username } = this.params;

    const usernameNormalized = User.normalizeUsername(username);
    const existingUser = await repository.findOne({
      where: { usernameNormalized },
    });
    if (existingUser) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        'Username is already taken',
      );
    }

    user.setUsername(username);

    return repository.save(user);
  }
}

export default SetUsernameCommand;
