import type { IClanReportService } from '../../../clans/reports/clanReportService';
import container from '../../../container';
import Job from '../../job';

class ApplySettingsReportDataJob extends Job<number> {
  async execute(reportId: number) {
    return container
      .resolve<IClanReportService>('ClanReportService')
      .applySettingsReportData(reportId);
  }
}

export default ApplySettingsReportDataJob;
