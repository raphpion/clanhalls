import ApplySettingsReportDataCommand from '../../../clans/reports/commands/applySettingsReportDataCommand';
import Job from '../../job';

class ApplySettingsReportDataJob extends Job<number> {
  async execute(reportId: number) {
    return new ApplySettingsReportDataCommand({ reportId }).execute();
  }
}

export default ApplySettingsReportDataJob;
