import Command from '../../../command';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import Credentials from '../credentials';

type Params = {
  clientId: string;
  updates: Partial<Pick<Credentials, 'name' | 'scope' | 'lastUsedAt'>>;
};

type Result = Credentials;

// TODO: Add permission checks
class UpdateCredentialsCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(Credentials);

    const { clientId, updates } = this.params;
    const credentials = await repository.findOne({
      where: { clientId },
      relations: ['user'],
    });

    if (!credentials) {
      throw new AppError(AppErrorCodes.NOT_FOUND, 'Credentials not found');
    }

    Object.assign(credentials, updates);

    const savedCredentials = await repository.save(credentials);
    return savedCredentials;
  }
}

export default UpdateCredentialsCommand;
