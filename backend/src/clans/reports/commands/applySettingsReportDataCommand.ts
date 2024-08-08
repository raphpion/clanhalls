import Command from '../../../command';
import db from '../../../db';
import ClanRank from '../../clanRank';
import SettingsReport from '../settingsReport';

type Params = {
  reportId: number;
};

class ApplySettingsReportDataCommand extends Command<Params> {
  async execute() {
    const queryRunner = db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(SettingsReport, {
        where: { id: this.params.reportId },
        relations: ['clan'],
      });

      const clan = await report.clan;

      if (clan.nameInGame !== report.data.name) {
        clan.nameInGame = report.data.name;
        await queryRunner.manager.save(clan);
      }

      for (const [rank, title] of Object.entries(report.data.ranks)) {
        let clanRank = await queryRunner.manager.findOne(ClanRank, {
          where: { clanId: clan.id, rank },
        });

        if (clanRank && clanRank.title === title) {
          continue;
        }

        if (!clanRank) {
          clanRank = new ClanRank();
          clanRank.clan = Promise.resolve(clan);
        }

        clanRank.rank = rank;
        clanRank.title = title;

        clanRank = await queryRunner.manager.save(clanRank);
      }

      report.appliedAt = new Date();
      await queryRunner.manager.save(report);

      clan.lastSyncedAt = new Date();
      await queryRunner.manager.save(clan);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

export default ApplySettingsReportDataCommand;
