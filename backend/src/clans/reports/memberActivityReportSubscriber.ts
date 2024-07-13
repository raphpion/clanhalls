import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import MemberActivityReport from './memberActivityReport';
import Player from '../../players/player';
import ClanPlayer from '../clanPlayer';

@EventSubscriber()
class MemberActivityReportSubscriber
  implements EntitySubscriberInterface<MemberActivityReport>
{
  listenTo() {
    return MemberActivityReport;
  }

  async afterInsert(event: InsertEvent<MemberActivityReport>) {
    await event.queryRunner.connect();
    await event.queryRunner.startTransaction();

    try {
      const receivedAt = event.entity.receivedAt;
      const clan = await event.entity.clan;

      for (const member of event.entity.data) {
        let player = await event.queryRunner.manager.findOne(Player, {
          where: { username: member.name },
        });

        if (!player) {
          player = new Player();
          player.username = member.name;
          player = await event.queryRunner.manager.save(player);
        }

        let clanPlayer = await event.queryRunner.manager.findOne(ClanPlayer, {
          where: { clanId: clan.id, playerId: player.id },
        });

        if (!clanPlayer) {
          clanPlayer = new ClanPlayer();
          clanPlayer.player = Promise.resolve(player);
          clanPlayer.clan = Promise.resolve(clan);
        }

        clanPlayer.rank = member.rank;
        clanPlayer.lastSeenAt = receivedAt;

        await event.queryRunner.manager.save(clanPlayer);
      }

      await event.queryRunner.commitTransaction();
    } catch (error) {
      await event.queryRunner.rollbackTransaction();
    }
  }
}

export default MemberActivityReportSubscriber;
