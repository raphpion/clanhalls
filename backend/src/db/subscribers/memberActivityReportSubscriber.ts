import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import MemberActivityReport from '../../clans/reports/memberActivityReport';
import container from '../../container';
import ApplyMemberActivityReportDataJob from '../../jobs/clans/reports/applyMemberActivityReportDataJob';
import type { IJobsService } from '../../jobs/jobsService';

@EventSubscriber()
class MemberActivityReportSubscriber
  implements EntitySubscriberInterface<MemberActivityReport>
{
  listenTo() {
    return MemberActivityReport;
  }

  async afterInsert(event: InsertEvent<MemberActivityReport>) {
    container
      .resolve<IJobsService>('JobsService')
      .add(ApplyMemberActivityReportDataJob, event.entity.id);
  }
}

export default MemberActivityReportSubscriber;
