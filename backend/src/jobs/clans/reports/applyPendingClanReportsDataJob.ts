import ApplyMemberActivityReportDataCommand from '../../../clans/reports/commands/applyMemberActivityReportDataCommand';
import ApplyMembersListReportDataCommand from '../../../clans/reports/commands/applyMembersListReportDataCommand';
import ApplySettingsReportDataCommand from '../../../clans/reports/commands/applySettingsReportDataCommand';
import MemberActivityReport from '../../../clans/reports/memberActivityReport';
import MembersListReport from '../../../clans/reports/membersListReport';
import SettingsReport from '../../../clans/reports/settingsReport';
import db from '../../../db';
import Job from '../../job';

type ReportEntry = {
  report: MemberActivityReport | MembersListReport | SettingsReport;
  type: 'memberActivity' | 'membersList' | 'settings';
  receivedAt: Date;
};

class ApplyPendinyPendingClanReportsJob extends Job<undefined> {
  async execute() {
    const memberActivityReports = await db
      .createQueryBuilder(MemberActivityReport, 'report')
      .where('report.appliedAt IS NULL')
      .getMany();

    const membersListReports = await db
      .createQueryBuilder(MembersListReport, 'report')
      .where('report.appliedAt IS NULL')
      .getMany();

    const latestSettingsReport = await db
      .createQueryBuilder(SettingsReport, 'report')
      .where('report.appliedAt IS NULL')
      .orderBy('report.receivedAt', 'DESC')
      .getOne();

    const reports: ReportEntry[] = [
      ...memberActivityReports.map((report) => ({
        report,
        type: 'memberActivity' as ReportEntry['type'],
        receivedAt: report.receivedAt,
      })),
      ...membersListReports.map((report) => ({
        report,
        type: 'membersList' as ReportEntry['type'],
        receivedAt: report.receivedAt,
      })),
      ...(latestSettingsReport && [
        {
          report: latestSettingsReport,
          type: 'settings' as ReportEntry['type'],
          receivedAt: latestSettingsReport.receivedAt,
        },
      ]),
    ].sort((a, b) => a.receivedAt.getTime() - b.receivedAt.getTime());

    for (const entry of reports) {
      switch (entry.type) {
        case 'memberActivity':
          await new ApplyMemberActivityReportDataCommand({
            reportId: entry.report.id,
          }).execute();
          break;

        case 'membersList':
          await new ApplyMembersListReportDataCommand({
            reportId: entry.report.id,
          }).execute();
          break;

        case 'settings':
          await new ApplySettingsReportDataCommand({
            reportId: entry.report.id,
          }).execute();
          break;
      }
    }
  }
}

export default ApplyPendinyPendingClanReportsJob;
