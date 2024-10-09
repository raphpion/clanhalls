import { WOMClient } from '@wise-old-man/utils';

import Command from '../../command';
import db from '../../db';
import { withSafeWiseOldMan } from '../../helpers/wiseOldMan';
import Player from '../player';

type Params = {
  player: Player;
};

class AssociatePlayerToWiseOldManCommand extends Command<Params> {
  async execute() {
    const queryRunner = db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { player } = this.params;
      console.log(player.username);

      if (player.wiseOldManId) {
        return;
      }

      const wiseOldMan = new WOMClient();
      const wiseOldManPlayer = await withSafeWiseOldMan(() =>
        wiseOldMan.players.getPlayerDetails(player.username.toLowerCase()),
      );

      if (!wiseOldManPlayer) {
        return;
      }

      player.wiseOldManId = wiseOldManPlayer.id;
      await queryRunner.manager.save(Player, player);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

export default AssociatePlayerToWiseOldManCommand;
