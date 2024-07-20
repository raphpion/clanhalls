import Command from '../../../command';
import db from '../../../db';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import Credentials from '../credentials';

type Params = {
  clientId: string;
};

class DeleteCredentialsCommand extends Command<Params> {
  async execute() {
    const repository = db.getRepository(Credentials);

    const { clientId } = this.params;
    const credentials = await repository.findOne({
      where: { clientId },
    });

    if (!credentials) {
      throw new AppError(AppErrorCodes.NOT_FOUND, 'Credentials not found');
    }

    await repository.remove(credentials);
  }
}

export default DeleteCredentialsCommand;
