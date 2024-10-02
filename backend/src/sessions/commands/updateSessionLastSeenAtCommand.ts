import Command from '../../command';
import db from '../../db';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import Session from '../session';

type Params = {
  uuid: string;
};

class UpdateSessionLastSeenAtCommand extends Command<Params> {
  async execute() {
    const { uuid } = this.params;
    const repository = db.getRepository(Session);

    const session = await repository.findOneBy({ uuid });
    if (!session) {
      throw new AppError(AppErrorCodes.NOT_FOUND, 'Session not found');
    }

    session.lastSeenAt = new Date();
    await repository.save(session);
  }
}

export default UpdateSessionLastSeenAtCommand;
