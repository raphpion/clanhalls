import type { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import SettingsReport from '../../clans/reports/settingsReport';
import container from '../../container';
import ApplySettingsReportDataJob from '../../jobs/clans/reports/applySettingsReportDataJob';
import type { IJobsService } from '../../jobs/jobsService';

@EventSubscriber()
class SettingsReportSubscriber
  implements EntitySubscriberInterface<SettingsReport>
{
  listenTo() {
    return SettingsReport;
  }

  async afterInsert(event: InsertEvent<SettingsReport>) {
    container
      .resolve<IJobsService>('JobsService')
      .add(ApplySettingsReportDataJob, event.entity.id);
  }
}

export default SettingsReportSubscriber;
