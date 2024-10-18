import { format } from 'date-fns';
import Joi from 'joi';

import { Seeder } from './seeder';
import Clan from '../../clans/clan';
import type { Settings } from '../../clans/reports/settingsReport';
import SettingsReport from '../../clans/reports/settingsReport';
import User from '../../users/user';

type SettingsReportSeeding = {
  user: string;
  clan: string;
  received_at: string;
  applied_at: string | null;
  data: Settings;
};

const settingsReportSeedingSchema = Joi.object<
  Record<string, SettingsReportSeeding>
>().pattern(
  Joi.string(),
  Joi.object({
    user: Joi.string().required(),
    clan: Joi.string().required(),
    received_at: Joi.string().required(),
    applied_at: Joi.string().allow(null).optional().default(null),
    data: Joi.object({
      name: Joi.string().required(),
      ranks: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    }),
  }),
);

class SettingsReportSeeder extends Seeder<
  SettingsReport,
  SettingsReportSeeding
> {
  entityName = SettingsReport.name;
  schema = settingsReportSeedingSchema;

  protected deserialize(seed: SettingsReportSeeding) {
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

    const report = new SettingsReport();
    report.user = Promise.resolve(user);
    report.clan = Promise.resolve(clan);
    report.receivedAt = new Date(seed.received_at);
    report.appliedAt = seed.applied_at ? new Date(seed.applied_at) : null;
    report.data = seed.data;

    return report;
  }

  protected async getIdentifier(entity: SettingsReport): Promise<string> {
    const [user, clan] = await Promise.all([entity.user, entity.clan]);
    return `${user.id}-${clan.id}-${format(entity.receivedAt, 'yyyy-MM-dd')}`;
  }
}

export default SettingsReportSeeder;
