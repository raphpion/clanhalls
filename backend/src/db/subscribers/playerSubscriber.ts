import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import container from '../../container';
import type { IJobsService } from '../../jobs/jobsService';
import AssociatePlayerToWiseOldManJob from '../../jobs/players/associatePlayerToWiseOldManJob';
import Player from '../../players/player';

@EventSubscriber()
class PlayerSubscriber implements EntitySubscriberInterface<Player> {
  listenTo() {
    return Player;
  }

  async afterInsert(event: InsertEvent<Player>) {
    return container
      .resolve<IJobsService>('JobsService')
      .add(AssociatePlayerToWiseOldManJob, event.entity.id);
  }

  async afterUpdate(event: UpdateEvent<Player>) {
    return container
      .resolve<IJobsService>('JobsService')
      .add(AssociatePlayerToWiseOldManJob, event.entity.id);
  }
}

export default PlayerSubscriber;
