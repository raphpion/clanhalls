import container from '../../container';
import type { IPlayerService } from '../../players/playerService';
import Job from '../job';

class AssociatePlayerToWiseOldManJob extends Job<number> {
  async execute(reportId: number) {
    return container
      .resolve<IPlayerService>('PlayerService')
      .associatePlayerToWiseOldMan(reportId);
  }
}

export default AssociatePlayerToWiseOldManJob;
