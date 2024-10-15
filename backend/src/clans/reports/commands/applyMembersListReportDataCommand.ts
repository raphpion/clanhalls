import { WOMClient } from '@wise-old-man/utils';
import { type QueryRunner } from 'typeorm';

import Command from '../../../command';
import { withSafeWiseOldMan } from '../../../helpers/wiseOldMan';
import Player from '../../../players/player';
import type ClanPlayer from '../../clanPlayer';
import MembersListReport from '../membersListReport';

type Params = {
  reportId: number;
};

class ApplyMembersListReportDataCommand extends Command<Params> {
  async execute() {
    const queryRunner = this.db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(MembersListReport, {
        where: { id: this.params.reportId },
        relations: ['clan'],
      });

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

    const wiseOldMan = new WOMClient();
    const nameChanges = await withSafeWiseOldMan(() =>
      wiseOldMan.nameChanges.searchNameChanges({ username: player.username }),
    );

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
    const wiseOldMan = new WOMClient();
    const wiseOldManPlayer = await withSafeWiseOldMan(() =>
      wiseOldMan.players.getPlayerDetailsById(wiseOldManId),
    );

    if (!wiseOldManPlayer) {
      return undefined;
    }

    return wiseOldManPlayer.displayName;
  }
}

export default ApplyMembersListReportDataCommand;
