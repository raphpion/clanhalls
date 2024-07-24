import Command from '../../command';
import db from '../../db';
import User from '../user';

type Params = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  pictureUrl: string;
};

type Result = User;

class CreateUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(User);
    const { googleId, email, emailVerified, pictureUrl } = this.params;

    const user = new User();
    user.googleId = googleId;
    user.changeEmail(email);
    user.emailVerified = emailVerified;
    user.pictureUrl = pictureUrl;

    return repository.save(user);
  }
}

export default CreateUserCommand;
