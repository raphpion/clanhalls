import Command from '../../../command';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type User from '../../../users/user';
import type Clan from '../../clan';
import type { ListMember } from '../membersListReport';
import MembersListReport from '../membersListReport';

type Params = {
  user: User;
  clan: Clan;
  members: ListMember[];
};

type Result = MembersListReport;

class CreateMembersListReportCommand extends Command<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(MembersListReport);

    const { user, clan, members } = this.params;

    const clanUser = await user.clanUser;
    if (!clanUser || clanUser.clanId !== clan.id) {
      throw new AppError(
        AppErrorCodes.BAD_REQUEST,
        'User is not a member of the clan',
      );
    }

    const membersListReport = new MembersListReport();

    membersListReport.data = members;
    membersListReport.clan = Promise.resolve(clan);
    membersListReport.user = Promise.resolve(user);

    const result = await repository.save(membersListReport);
    return result;
  }
}

export default CreateMembersListReportCommand;
