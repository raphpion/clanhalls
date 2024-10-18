import { format } from 'date-fns';
import Joi from 'joi';

import Seeder from './seeder';
import Clan from '../../clans/clan';
import CLAN_RANKS from '../../clans/ranks';
import type { MemberActivity } from '../../clans/reports/memberActivityReport';
import MemberActivityReport from '../../clans/reports/memberActivityReport';
import User from '../../users/user';

type MemberActivityReportSeed = {
  user: string;
  clan: string;
  received_at: string;
  applied_at: string | null;
  data: MemberActivity[];
};

const memberActivityReportSeedSchema = Joi.object<
  Record<string, MemberActivityReportSeed>
>().pattern(
  Joi.string(),
  Joi.object({
    user: Joi.string().required(),
    clan: Joi.string().required(),
    received_at: Joi.string().required(),
    applied_at: Joi.string().allow(null).optional().default(null),
    data: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        rank: Joi.string()
          .required()
          .valid(...Object.values(CLAN_RANKS)),
      }),
    ),
  }),
);

class MemberActivityReportSeeder extends Seeder<
  MemberActivityReport,
  MemberActivityReportSeed
> {
  entityName = MemberActivityReport.name;
  schema = memberActivityReportSeedSchema;

  protected deserialize(seed: MemberActivityReportSeed) {
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

    const report = new MemberActivityReport();
    report.user = Promise.resolve(user);
    report.clan = Promise.resolve(clan);
    report.receivedAt = new Date(seed.received_at);
    report.appliedAt = seed.applied_at ? new Date(seed.applied_at) : null;
    report.data = seed.data;

    return report;
  }

  protected async getIdentifier(entity: MemberActivityReport): Promise<string> {
    const [user, clan] = await Promise.all([entity.user, entity.clan]);
    return `${user.id}-${clan.id}-${format(entity.receivedAt, 'yyyy-MM-dd')}`;
  }
}

export default MemberActivityReportSeeder;
