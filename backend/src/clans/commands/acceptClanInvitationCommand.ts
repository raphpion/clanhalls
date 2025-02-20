import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type User from '../../users/user';
import ClanInvitation from '../clanInvitation';
import ClanUser from '../clanUser';

type Params = {
  user: User;
  code: string;
};

class AcceptClanInvitationCommand extends Command<Params> {
  async execute() {
    const queryRunner = this.db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { user, code } = this.params;

      const clanUser = await user.clanUser;
      if (clanUser) {
        throw new AppError(
          AppErrorCodes.BAD_REQUEST,
          'User is already in a clan',
        );
      }

      const invitation = await queryRunner.manager.findOne(ClanInvitation, {
        where: { code },
        relations: ['clan'],
      });

      if (!invitation) {
        throw new AppError(AppErrorCodes.NOT_FOUND, 'Invitation not found');
      }

      if (!invitation.isAvailable) {
        throw new AppError(
          AppErrorCodes.BAD_REQUEST,
          'Invitation is not available',
        );
      }

      const clan = await invitation.clan;

      const newClanUser = new ClanUser();
      newClanUser.user = Promise.resolve(user);
      newClanUser.clan = Promise.resolve(clan);
      newClanUser.clanInvitation = Promise.resolve(invitation);

      await queryRunner.manager.save(newClanUser);

      invitation.uses += 1;
      await queryRunner.manager.save(invitation);

      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}

export default AcceptClanInvitationCommand;
