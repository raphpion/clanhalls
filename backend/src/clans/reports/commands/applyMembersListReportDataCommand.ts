import { type QueryRunner } from 'typeorm';

import Command from '../../../command';
import container from '../../../container';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import Player from '../../../players/player';
import type { IWiseOldManService } from '../../../services/wiseOldManService';
import type ClanPlayer from '../../clanPlayer';
import MembersListReport from '../membersListReport';

type Params = {
  reportId: number;
};

class ApplyMembersListReportDataCommand extends Command<Params> {
  private readonly wiseOldMan =
    container.resolve<IWiseOldManService>('WiseOldManService');

  async execute() {
    const queryRunner = this.db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(MembersListReport, {
        where: { id: this.params.reportId },
        relations: ['clan', 'clan.clanPlayers'],
      });

      if (report.appliedAt) {
        throw new AppError(
          AppErrorCodes.BAD_REQUEST,
          'Report has already been applied',
        );
      }

      const clan = await report.clan;
      const clanPlayers = await clan.clanPlayers;

      const clanPlayersToRemove: ClanPlayer[] = [];
      const clanPlayersToUpdate: ClanPlayer[] = [];

      for (const clanPlayer of clanPlayers) {
        const player = await clanPlayer.player;
        let member = report.data.find((m) => m.name === player.username);

        if (!member) {
          const newNameResult = await this.searchForPlayerNewName(
            queryRunner,
            player,
            clanPlayer.lastSeenAt,
          );

          if (!newNameResult) {
            clanPlayersToRemove.push(clanPlayer);
            continue;
          }

          member = report.data.find((m) => m.name === newNameResult.newName);
          if (!member) {
            clanPlayersToRemove.push(clanPlayer);
            continue;
          }

          player.username = newNameResult.newName;
          player.wiseOldManId = newNameResult.wiseOldManId;
          await queryRunner.manager.save(player);
        }

        if (clanPlayer.rank !== member.rank) {
          clanPlayer.rank = member.rank;
          clanPlayersToUpdate.push(clanPlayer);
        }
      }

      report.appliedAt = new Date();

      await queryRunner.manager.remove(clanPlayersToRemove);
      await queryRunner.manager.save(clanPlayersToUpdate);
      await queryRunner.manager.save(report);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async searchForPlayerNewName(
    queryRunner: QueryRunner,
    player: Player,
    lastSeenAt: Date,
  ): Promise<{ newName: string; wiseOldManId: number } | undefined> {
    if (player.wiseOldManId) {
      const newName = await this.getPlayerNewNameFromWiseOldMan(
        player.wiseOldManId,
      );

      return newName
        ? { newName, wiseOldManId: player.wiseOldManId }
        : undefined;
    }

    const nameChanges = await this.wiseOldMan.searchNameChanges({
      username: player.username,
    });

    const filteredNameChanges = nameChanges
      .filter((nc) => nc.createdAt > lastSeenAt)
      .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());

    if (!filteredNameChanges?.length) {
      return undefined;
    }

    for (const nameChange of filteredNameChanges) {
      const player = await queryRunner.manager.findOne(Player, {
        where: { username: nameChange.oldName },
      });

      if (player) {
        return {
          newName: nameChange.newName,
          wiseOldManId: nameChange.playerId,
        };
      }
    }

    return undefined;
  }

  private async getPlayerNewNameFromWiseOldMan(wiseOldManId: number) {
    const wiseOldManPlayer =
      await this.wiseOldMan.getPlayerDetailsById(wiseOldManId);

    if (!wiseOldManPlayer) {
      return undefined;
    }

    return wiseOldManPlayer.displayName;
  }
}

export default ApplyMembersListReportDataCommand;
