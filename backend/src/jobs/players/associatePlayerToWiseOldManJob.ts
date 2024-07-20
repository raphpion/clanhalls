import AssociatePlayerToWiseOldManCommand from '../../players/commands/associatePlayerToWiseOldManCommand';
import Job from '../job';

class AssociatePlayerToWiseOldManJob extends Job<number> {
  async execute(playerId: number) {
    return new AssociatePlayerToWiseOldManCommand({ playerId }).execute();
  }
}

export default AssociatePlayerToWiseOldManJob;
