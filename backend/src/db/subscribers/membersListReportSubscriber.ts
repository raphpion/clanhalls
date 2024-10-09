import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import MembersListReport from '../../clans/reports/membersListReport';
import container from '../../container';
import ApplyMembersListReportDataJob from '../../jobs/clans/reports/applyMembersListReportDataJob';
import type { IJobsService } from '../../jobs/jobsService';

@EventSubscriber()
class MembersListReportSubscriber
  implements EntitySubscriberInterface<MembersListReport>
{
  listenTo() {
    return MembersListReport;
  }

  async afterInsert(event: InsertEvent<MembersListReport>) {
    container
      .resolve<IJobsService>('JobsService')
      .add(ApplyMembersListReportDataJob, event.entity.id);
  }
}

export default MembersListReportSubscriber;
