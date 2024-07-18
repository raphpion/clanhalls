
import type { IClanReportService } from '../../../clans/reports/clanReportService';
import container from '../../../container';
import Job from '../../job';

class ApplyMemberActivityReportDataJob extends Job<number> {
  async execute(reportId: number) {
    return container
      .resolve<IClanReportService>('ClanReportService')
      .applyMemberActivityReportData(reportId);
  }
}

export default ApplyMemberActivityReportDataJob;
