import Command from '../../command';
import db from '../../db';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type User from '../../users/user';
import Clan from '../clan';

type Params = {
  user: User;
};

class DeleteUsersClanCommand extends Command<Params> {
  async execute() {
    const repository = db.getRepository(Clan);

    const { user } = this.params;

    const clanUser = await user.clanUser;
    const clan = await clanUser?.clan;
    if (!clanUser || !clan) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not in a clan');
    }

    if (!clanUser.isAdmin) {
      throw new AppError(
        AppErrorCodes.PERMISSION_DENIED,
        'Only clan admins may delete their clan',
      );
    }

    await repository.remove(clan);
  }
}

export default DeleteUsersClanCommand;
