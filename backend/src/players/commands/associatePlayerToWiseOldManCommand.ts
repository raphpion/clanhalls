import Command from '../../command';
import container from '../../container';
import type { IWiseOldManService } from '../../services/wiseOldManService';
import Player from '../player';

type Params = {
  player: Player;
};

class AssociatePlayerToWiseOldManCommand extends Command<Params> {
  private readonly wiseOldMan =
    container.resolve<IWiseOldManService>('WiseOldManService');

  async execute() {
    const queryRunner = this.db.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { player } = this.params;

      if (player.wiseOldManId) {
        return;
      }

      const wiseOldManPlayer = await this.wiseOldMan.getPlayerDetails(
        player.username.toLowerCase(),
      );

      if (!wiseOldManPlayer) {
        return;
      }

      player.wiseOldManId = wiseOldManPlayer.id;
      await queryRunner.manager.save(Player, player);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  }
}

export default AssociatePlayerToWiseOldManCommand;
