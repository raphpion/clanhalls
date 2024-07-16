import { WOMClient } from '@wise-old-man/utils';
import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import Player from './player';

@EventSubscriber()
class PlayerSubscriber implements EntitySubscriberInterface<Player> {
  listenTo() {
    return Player;
  }

  async afterInsert(event: InsertEvent<Player>) {
    this.associateWiseOldManId(event);
  }

  async afterUpdate(event: UpdateEvent<Player>) {
    this.associateWiseOldManId(event);
  }

  private async associateWiseOldManId(
    event: InsertEvent<Player> | UpdateEvent<Player>
  ) {
    if (event.entity.wiseOldManId) {
      return;
    }

    const wiseOldMan = new WOMClient();
    const wiseOldManPlayer = await wiseOldMan.players.getPlayerDetails(
      event.entity.username
    );
    if (!wiseOldManPlayer) {
      return;
    }

    event.entity.wiseOldManId = wiseOldManPlayer.id;
    await event.manager.save(event.entity);
  }
}

export default PlayerSubscriber;
