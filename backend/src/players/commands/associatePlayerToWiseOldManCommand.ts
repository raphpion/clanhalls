import { WOMClient } from '@wise-old-man/utils';

import Command from '../../command';
import db from '../../db';
import { withSafeWiseOldMan } from '../../helpers/wiseOldMan';
import Player from '../player';

type Params = {
  playerId: number;
};

class AssociatePlayerToWiseOldManCommand extends Command<Params> {
  async execute() {
    const repository = db.getRepository(Player);
    const player = await repository.findOne({
      where: { id: this.params.playerId },
    });
    if (!player || player.wiseOldManId) {
      return;
    }

    const wiseOldMan = new WOMClient();
    const wiseOldManPlayer = await withSafeWiseOldMan(() =>
      wiseOldMan.players.getPlayerDetails(player.username)
    );

    if (!wiseOldManPlayer) {
      return;
    }

    player.wiseOldManId = wiseOldManPlayer.id;
    await repository.save(player);
  }
}

export default AssociatePlayerToWiseOldManCommand;
