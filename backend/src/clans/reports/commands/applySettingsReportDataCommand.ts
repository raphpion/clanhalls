import Command from '../../../command';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import ClanRank from '../../clanRank';
import SettingsReport from '../settingsReport';

type Params = {
  reportId: number;
};

class ApplySettingsReportDataCommand extends Command<Params> {
  async execute() {
    const queryRunner = this.db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(SettingsReport, {
        where: { id: this.params.reportId },
        relations: ['clan'],
      });

      if (report.appliedAt) {
        throw new AppError(
          AppErrorCodes.BAD_REQUEST,
          'Report has already been applied',
        );
      }

      const clan = await report.clan;

      if (clan.nameInGame !== report.data.name) {
        clan.nameInGame = report.data.name;
        await queryRunner.manager.save(clan);
      }

      const previousClanRanks = await queryRunner.manager.find(ClanRank, {
        where: { clanId: clan.id },
      });

      const newClanRanks: ClanRank[] = [];

      for (const { rank, title } of Object.values(report.data.ranks)) {
        let clanRank = previousClanRanks.find((r) => r.rank === rank);
        if (clanRank && clanRank.title === title) {
          newClanRanks.push(clanRank);
          continue;
        }

        if (!clanRank) {
          clanRank = new ClanRank();
          clanRank.clan = Promise.resolve(clan);
        }

        clanRank.rank = rank;
        clanRank.title = title;

        clanRank = await queryRunner.manager.save(clanRank);
        newClanRanks.push(clanRank);
      }

      const clanRanksToDelete = previousClanRanks.filter(
        (rank) => !newClanRanks.includes(rank),
      );

      await queryRunner.manager.remove(clanRanksToDelete);

      report.appliedAt = new Date();
      await queryRunner.manager.save(report);

      clan.lastSyncedAt = report.appliedAt;
      await queryRunner.manager.save(clan);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}

export default ApplySettingsReportDataCommand;
