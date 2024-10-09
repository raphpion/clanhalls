import Command from '../../../command';
import db from '../../../db';
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
    const repository = db.getRepository(MembersListReport);
    const { user, clan, members } = this.params;

    const membersListReport = new MembersListReport();

    membersListReport.data = members;
    membersListReport.clan = Promise.resolve(clan);
    membersListReport.user = Promise.resolve(user);

    const result = await repository.save(membersListReport);
    return result;
  }
}

export default CreateMembersListReportCommand;
