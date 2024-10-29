import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import User from '../user';

type Params = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  pictureUrl: string;
};

type Result = User;

class SignUpUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(User);

    const { googleId, email, emailVerified, pictureUrl } = this.params;

    const existingUserByGoogleId = await repository.findOne({
      where: { googleId },
    });

    if (existingUserByGoogleId) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        'Google ID is already taken',
      );
    }

    const existingUserByEmailNormalized = await repository.findOne({
      where: { emailNormalized: User.normalizeEmail(email) },
    });

    if (existingUserByEmailNormalized) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        'Email is already taken',
      );
    }

    const user = new User();
    user.googleId = googleId;
    user.changeEmail(email);
    user.emailVerified = emailVerified;
    user.pictureUrl = pictureUrl;

    return repository.save(user);
  }
}

export default SignUpUserCommand;
