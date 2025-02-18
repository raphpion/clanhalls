import ApplyMemberActivityReportDataCommand from '../../../clans/reports/commands/applyMemberActivityReportDataCommand';
import Job from '../../job';

class ApplyMemberActivityReportDataJob extends Job<number> {
  async execute(reportId: number) {
    return new ApplyMemberActivityReportDataCommand({ reportId }).execute();
  }
}

export default ApplyMemberActivityReportDataJob;
