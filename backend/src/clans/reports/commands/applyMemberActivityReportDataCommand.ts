import { WOMClient } from '@wise-old-man/utils';
import type { QueryRunner } from 'typeorm';

import Command from '../../../command';
import db from '../../../db';
import { withSafeWiseOldMan } from '../../../helpers/wiseOldMan';
import Player from '../../../players/player';
import ClanPlayer from '../../clanPlayer';
import type { MemberActivity } from '../memberActivityReport';
import MemberActivityReport from '../memberActivityReport';

type Params = {
  reportId: number;
};

class ApplyMemberActivityReportDataCommand extends Command<Params> {
  private readonly ignoredRanks = ['GUEST', 'JMOD'];

  async execute() {
    const queryRunner = db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(MemberActivityReport, {
        where: { id: this.params.reportId },
        relations: ['clan'],
      });

      const clan = await report.clan;

      for (const member of report.data) {
        if (this.ignoredRanks.includes(member.rank)) {
          continue;
        }

        let player = await queryRunner.manager.findOne(Player, {
          where: { username: member.name },
        });

        if (!player) {
          player = await withSafeWiseOldMan(() =>
            this.findPlayerWithPreviousName(queryRunner, member)
          );

          if (!player) {
            player = new Player();
            player.username = member.name;
            player = await queryRunner.manager.save(player);
          }
        }

        let clanPlayer = await queryRunner.manager.findOne(ClanPlayer, {
          where: { clanId: clan.id, playerId: player.id },
        });

        if (!clanPlayer) {
          clanPlayer = new ClanPlayer();
          clanPlayer.player = Promise.resolve(player);
          clanPlayer.clan = Promise.resolve(clan);
        }

        if (clanPlayer.lastSeenAt < report.receivedAt) {
          clanPlayer.lastSeenAt = report.receivedAt;
          clanPlayer.rank = member.rank;

          await queryRunner.manager.save(clanPlayer);
        }
      }

      report.appliedAt = new Date();
      await queryRunner.manager.save(report);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async findPlayerWithPreviousName(
    queryRunner: QueryRunner,
    member: MemberActivity
  ) {
    const wiseOldMan = new WOMClient();

    // const safeUsername = member.name.toLowerCase().replace(' ', '%20');
    // const matchingPlayer = (
    //   await wiseOldMan.players.searchPlayers(safeUsername)
    const matchingPlayer = (
      await wiseOldMan.players.searchPlayers(member.name)
    ).find((player) => player.displayName === member.name);
    if (!matchingPlayer) {
      return undefined;
    }

    const nameChanges = await wiseOldMan.players.getPlayerNames(
      matchingPlayer.username
    );
    if (nameChanges.length === 0) {
      return undefined;
    }

    let player: Player | undefined;

    if (nameChanges.length > 0) {
      for (const nameChange of nameChanges) {
        player = await queryRunner.manager.findOne(Player, {
          where: { username: nameChange.oldName },
        });

        if (player) {
          player.wiseOldManId = nameChange.playerId;
          player.username = member.name;
          player = await queryRunner.manager.save(player);

          break;
        }
      }
    }

    return player;
  }
}

export default ApplyMemberActivityReportDataCommand;
