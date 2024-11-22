import { format } from 'date-fns';
import Joi from 'joi';

import Seeder from './seeder';
import Clan from '../../clans/clan';
import type { ListMember } from '../../clans/reports/membersListReport';
import MembersListReport from '../../clans/reports/membersListReport';
import User from '../../users/user';

type MembersListReportSeed = {
  user: string;
  clan: string;
  received_at: string;
  applied_at: string | null;
  data: ListMember[];
};

const membersListReportSeedSchema = Joi.object<
  Record<string, MembersListReportSeed>
>().pattern(
  Joi.string(),
  Joi.object({
    user: Joi.string().required(),
    clan: Joi.string().required(),
    received_at: Joi.string().required(),
    applied_at: Joi.string().required().allow(null).optional().default(null),
    data: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        rank: Joi.number().min(-1).max(127).required(),
      }),
    ),
  }),
);

class MembersListReportSeeder extends Seeder<
  MembersListReport,
  MembersListReportSeed
> {
  entityName = MembersListReport.name;
  schema = membersListReportSeedSchema;

  protected deserialize(seed: MembersListReportSeed) {
    const clan = this.seedingService.getEntity(Clan, seed.clan);
    if (!clan) {
      console.log(`Clan not found: ${seed.clan}. Skipping...`);
      return;
    }

    const user = this.seedingService.getEntity(User, seed.user);
    if (!user) {
      console.log(`User not found: ${seed.user}. Skipping...`);
      return;
    }

    const report = new MembersListReport();
    report.user = Promise.resolve(user);
    report.clan = Promise.resolve(clan);
    report.receivedAt = new Date(seed.received_at);
    report.appliedAt = seed.applied_at ? new Date(seed.applied_at) : null;
    report.data = seed.data;

    return report;
  }

  protected async getIdentifier(entity: MembersListReport): Promise<string> {
    const [user, clan] = await Promise.all([entity.user, entity.clan]);
    return `${user.id}-${clan.id}-${format(entity.receivedAt, 'yyyy-MM-dd')}`;
  }
}

export default MembersListReportSeeder;
