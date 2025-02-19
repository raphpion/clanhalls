import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type User from '../../users/user';
import ClanInvitation from '../clanInvitation';

type Params = {
  user: User;
  uuid: string;
};

class DisableClanInvitationCommand extends Command<Params> {
  async execute() {
    const repository = this.db.getRepository(ClanInvitation);

    const { user, uuid } = this.params;

    const clanUser = await user.clanUser;
    const clan = await clanUser?.clan;
    if (!clanUser || !clan) {
      throw new AppError(AppErrorCodes.BAD_REQUEST, 'User is not in a clan');
    }

    if (!clanUser.isAdmin) {
      throw new AppError(
        AppErrorCodes.PERMISSION_DENIED,
        'Only clan admins may disable clan invitations',
      );
    }

    const invitation = await repository.findOne({
      where: { uuid, clanId: clan.id },
    });

    if (!invitation) {
      throw new AppError(AppErrorCodes.NOT_FOUND, 'Clan invitation not found');
    }

    if (invitation.disabledAt) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Clan invitation is already disabled',
      );
    }

    if (invitation.expiresAt && invitation.expiresAt <= new Date()) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Cannot disable expired invitation',
      );
    }

    if (invitation.maxUses && invitation.uses >= invitation.maxUses) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'Cannot disable invitation that has reached max uses',
      );
    }

    invitation.disabledAt = new Date();
    if (invitation.expiresAt) invitation.expiresAt = null;
    await repository.save(invitation);
  }
}

export default DisableClanInvitationCommand;
