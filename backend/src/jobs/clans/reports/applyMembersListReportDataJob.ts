import ApplyMembersListReportDataCommand from '../../../clans/reports/commands/applyMembersListReportDataCommand';
import Job from '../../job';

class ApplyMembersListReportDataJob extends Job<number> {
  async execute(reportId: number) {
    return new ApplyMembersListReportDataCommand({ reportId }).execute();
  }
}

export default ApplyMembersListReportDataJob;
