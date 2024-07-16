import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import SettingsReport from './settingsReport';
import ClanRank from '../clanRank';

@EventSubscriber()
class SettingsReportSubscriber
  implements EntitySubscriberInterface<SettingsReport>
{
  listenTo() {
    return SettingsReport;
  }

  async afterInsert(event: InsertEvent<SettingsReport>) {
    await event.queryRunner.connect();
    await event.queryRunner.startTransaction();

    try {
      const clan = await event.entity.clan;

      if (clan.nameInGame !== event.entity.data.name) {
        clan.nameInGame = event.entity.data.name;
        await event.queryRunner.manager.save(clan);
      }

      for (const [rank, title] of Object.entries(event.entity.data.ranks)) {
        let clanRank = await event.queryRunner.manager.findOne(ClanRank, {
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

        clanRank = await event.queryRunner.manager.save(clanRank);
      }

      await event.queryRunner.commitTransaction();
    } catch (error) {
      await event.queryRunner.rollbackTransaction();
    }
  }
}

export default SettingsReportSubscriber;
