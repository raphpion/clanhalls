import type { QueryRunner } from 'typeorm';

import Command from '../../../command';
import container from '../../../container';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import Player from '../../../players/player';
import type { IWiseOldManService } from '../../../services/wiseOldManService';
import ClanPlayer from '../../clanPlayer';
import type { MemberActivity } from '../memberActivityReport';
import MemberActivityReport from '../memberActivityReport';

type Params = {
  reportId: number;
};

class ApplyMemberActivityReportDataCommand extends Command<Params> {
  private readonly ignoredRanks = ['GUEST', 'JMOD'];
  private readonly wiseOldMan =
    container.resolve<IWiseOldManService>('WiseOldManService');

  async execute() {
    const queryRunner = this.db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(MemberActivityReport, {
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

      for (const member of report.data) {
        if (this.ignoredRanks.includes(member.rank)) {
          continue;
        }

        let player = await queryRunner.manager.findOne(Player, {
          where: { username: member.name },
        });

        if (!player) {
          player = await this.findPlayerWithPreviousName(queryRunner, member);

          if (!player) {
            player = new Player();
            player.username = member.name;

            const wiseOldManPlayer = await this.wiseOldMan.getPlayerDetails(
              player.username.toLowerCase(),
            );

            if (wiseOldManPlayer) {
              player.wiseOldManId = wiseOldManPlayer.id;
            }

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

        if (
          !clanPlayer.lastSeenAt ||
          clanPlayer.lastSeenAt < report.receivedAt
        ) {
          clanPlayer.lastSeenAt = report.receivedAt;
          clanPlayer.rank = member.rank;

          await queryRunner.manager.save(clanPlayer);
        }
      }

      report.appliedAt = new Date();
      await queryRunner.manager.save(report);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async findPlayerWithPreviousName(
    queryRunner: QueryRunner,
    member: MemberActivity,
  ) {
    const nameChanges = await this.wiseOldMan.getPlayerNames(member.name);
    if (!nameChanges?.length) {
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
