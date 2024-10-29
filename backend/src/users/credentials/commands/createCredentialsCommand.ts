import Command from '../../../command';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type User from '../../user';
import Credentials from '../credentials';

type Params = {
  user: User;
  name: string;
  scope: string;
};

type Result = [Credentials, string];

class CreateCredentialsCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(Credentials);

    if (!Credentials.validateScope(this.params.scope)) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'Invalid scope');
    }

    const { name, scope, user } = this.params;
    const credentials = new Credentials();
    credentials.name = name;
    credentials.scope = scope;
    credentials.user = Promise.resolve(user);
    credentials.generateClientId();

    const clientSecret = await credentials.generateClientSecret();
    const savedCredentials = await repository.save(credentials);

    return [savedCredentials, clientSecret] as Result;
  }
}

export default CreateCredentialsCommand;
