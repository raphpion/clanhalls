import ApplyMemberActivityReportDataCommand from '../../../clans/reports/commands/applyMemberActivityReportDataCommand';
import MemberActivityReport from '../../../clans/reports/memberActivityReport';
import db from '../../../db';
import Job from '../../job';

class ApplyPendingMemberActivityReportDataJob extends Job<undefined> {
  async execute() {
    const reports = await db
      .createQueryBuilder(MemberActivityReport, 'report')
      .where('report.appliedAt IS NULL')
      .getMany();

    for (const report of reports) {
      await new ApplyMemberActivityReportDataCommand({
        reportId: report.id,
      }).execute();
    }
  }
}

export default ApplyPendingMemberActivityReportDataJob;
