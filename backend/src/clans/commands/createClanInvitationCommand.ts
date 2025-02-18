import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type User from '../../users/user';
import ClanInvitation from '../clanInvitation';

type Params = {
  user: User;
  description: string | null;
  expiresAt: Date | null;
  maxUses: number | null;
};

class CreateClanInvitationCommand extends Command<Params> {
  async execute() {
    const repository = this.db.getRepository(ClanInvitation);

    const { user, description, expiresAt, maxUses } = this.params;

    const clanUser = await user.clanUser;
    if (!clanUser) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'The user is not in a clan',
      );
    }

    if (!clanUser.isAdmin) {
      throw new AppError(
        AppErrorCodes.PERMISSION_DENIED,
        'Only clan admins can create invitations',
      );
    }

    const clanInvitation = new ClanInvitation();
    clanInvitation.sender = Promise.resolve(user);
    clanInvitation.clan = clanUser.clan;
    clanInvitation.description = description;
    clanInvitation.expiresAt = expiresAt;
    clanInvitation.maxUses = maxUses;
    await repository.save(clanInvitation);
  }
}

export default CreateClanInvitationCommand;
