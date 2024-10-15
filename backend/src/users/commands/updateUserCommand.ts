
import Command from '../../command';
import User from '../user';

type Params = {
  user: User;
  updates: Partial<Pick<User, 'username' | 'pictureUrl' | 'emailVerified'>>;
};

type Result = User;

class UpdateUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);

    const { user, updates } = this.params;

    if (updates.username) {
      user.setUsername(updates.username);
    }

    if (updates.pictureUrl) {
      user.setPictureUrl(updates.pictureUrl);
    }

    if (updates.emailVerified) {
      user.verifyEmail();
    }

    return repository.save(user);
  }
}

export default UpdateUserCommand;
