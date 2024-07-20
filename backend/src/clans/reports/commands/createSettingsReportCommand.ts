import Command from '../../../command';
import db from '../../../db';
import type User from '../../../users/user';
import type Clan from '../../clan';
import type { Settings } from '../settingsReport';
import SettingsReport from '../settingsReport';

type Params = {
  user: User;
  clan: Clan;
  settings: Settings;
};

type Result = SettingsReport;

class CreateSettingsReportCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(SettingsReport);

    const { clan, settings, user } = this.params;
    const settingsReport = new SettingsReport();

    settingsReport.data = settings;
    settingsReport.clan = Promise.resolve(clan);
    settingsReport.user = Promise.resolve(user);

    const result = await repository.save(settingsReport);
    return result;
  }
}

export default CreateSettingsReportCommand;
