import Command from '../../../command';
import db from '../../../db';
import type User from '../../../users/user';
import type Clan from '../../clan';
import type { MemberActivity } from '../memberActivityReport';
import MemberActivityReport from '../memberActivityReport';

type Params = {
  user: User;
  clan: Clan;
  members: MemberActivity[];
};

type Result = MemberActivityReport;

class CreateMemberActivityReportCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(MemberActivityReport);
    const { user, clan, members } = this.params;

    const memberActivityReport = new MemberActivityReport();

    memberActivityReport.data = members;
    memberActivityReport.clan = Promise.resolve(clan);
    memberActivityReport.user = Promise.resolve(user);

    const result = await repository.save(memberActivityReport);
    return result;
  }
}

export default CreateMemberActivityReportCommand;
