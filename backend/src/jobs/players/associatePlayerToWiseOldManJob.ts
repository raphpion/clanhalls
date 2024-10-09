import AssociatePlayerToWiseOldManCommand from '../../players/commands/associatePlayerToWiseOldManCommand';
import type Player from '../../players/player';
import Job from '../job';

class AssociatePlayerToWiseOldManJob extends Job<Player> {
  async execute(player: Player) {
    return new AssociatePlayerToWiseOldManCommand({ player }).execute();
  }
}

export default AssociatePlayerToWiseOldManJob;
