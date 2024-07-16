import { WOMClient } from '@wise-old-man/utils';
import type {
  EntitySubscriberInterface,
  InsertEvent,
  QueryRunner,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import type { MemberActivity } from './memberActivityReport';
import MemberActivityReport from './memberActivityReport';
import Player from '../../players/player';
import ClanPlayer from '../clanPlayer';

@EventSubscriber()
class MemberActivityReportSubscriber
  implements EntitySubscriberInterface<MemberActivityReport>
{
  private readonly ignoredRanks = ['GUEST', 'JMOD'];
  listenTo() {
    return MemberActivityReport;
  }

  async afterInsert(event: InsertEvent<MemberActivityReport>) {
    const queryRunner = event.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const receivedAt = event.entity.receivedAt;
      const clan = await event.entity.clan;

      for (const member of event.entity.data) {
        if (this.ignoredRanks.includes(member.rank)) {
          continue;
        }

        let player = await queryRunner.manager.findOne(Player, {
          where: { username: member.name },
        });

        if (!player) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            try {
              player = await this.findPlayerWithPreviousName(
                queryRunner,
                member
              );
              break;
            } catch (error) {
              // Retry in 60 seconds if the request fails because of rate limiting
              // See https://docs.wiseoldman.net/#rate-limits--api-keys
              console.log(Object.entries(error).map(([k, v]) => `${k}: ${v}`));
              if (error.name === 'RateLimitError') {
                console.log('Rate Limit Error... Retrying in 60 seconds...');
                await new Promise((r) => setTimeout(r, 60000));
                console.log('Resuming...');
              } else if (error.name !== 'NotFoundError') {
                throw error;
              }
            }
          }

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
        clanPlayer.lastSeenAt = receivedAt;

        await queryRunner.manager.save(clanPlayer);
      }

      await queryRunner.commitTransaction();
      console.log('Transaction committed!');
    } catch (error) {
      console.log('Error processing member activity report:', error);
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
    const nameChanges = await wiseOldMan.players.getPlayerNames(member.name);
    console.log(`nameChanges for ${member.name}:`, nameChanges);

    let player: Player | undefined;

    // TODO: check if it's possible that the player went from old name to new name
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

export default MemberActivityReportSubscriber;
