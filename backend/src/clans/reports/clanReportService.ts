import { WOMClient } from '@wise-old-man/utils';
import { injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';

import type { MemberActivity } from './memberActivityReport';
import MemberActivityReport from './memberActivityReport';
import SettingsReport from './settingsReport';
import db from '../../db';
import { withSafeWiseOldMan } from '../../helpers/wiseOldMan';
import Player from '../../players/player';
import ClanPlayer from '../clanPlayer';
import ClanRank from '../clanRank';

export interface IClanReportService {
  applyMemberActivityReportData(reportId: number): Promise<void>;
  applySettingsReportData(reportId: number): Promise<void>;
}

@injectable()
class ClanReportService implements IClanReportService {
  async applyMemberActivityReportData(reportId: number): Promise<void> {
    const queryRunner = db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(MemberActivityReport, {
        where: { id: reportId },
        relations: ['clan'],
      });

      const clan = await report.clan;

      const ignoredRanks = ['GUEST', 'JMOD'];
      for (const member of report.data) {
        if (ignoredRanks.includes(member.rank)) {
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

        clanPlayer.rank = member.rank;
        clanPlayer.lastSeenAt = report.receivedAt;

        await queryRunner.manager.save(clanPlayer);
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

  async applySettingsReportData(reportId: number): Promise<void> {
    const queryRunner = db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const report = await queryRunner.manager.findOne(SettingsReport, {
        where: { id: reportId },
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

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // TODO: check if we move this
  private async findPlayerWithPreviousName(
    queryRunner: QueryRunner,
    member: MemberActivity
  ) {
    const safeUsername = member.name.toLowerCase().replace(' ', '%20');

    const wiseOldMan = new WOMClient();
    const matchingPlayer = (
      await wiseOldMan.players.searchPlayers(safeUsername)
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

export default ClanReportService;
