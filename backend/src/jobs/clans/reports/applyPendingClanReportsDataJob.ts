import ApplyMemberActivityReportDataCommand from '../../../clans/reports/commands/applyMemberActivityReportDataCommand';
import ApplyMembersListReportDataCommand from '../../../clans/reports/commands/applyMembersListReportDataCommand';
import ApplySettingsReportDataCommand from '../../../clans/reports/commands/applySettingsReportDataCommand';
import MemberActivityReport from '../../../clans/reports/memberActivityReport';
import MembersListReport from '../../../clans/reports/membersListReport';
import SettingsReport from '../../../clans/reports/settingsReport';
import Job from '../../job';

type ReportEntry = {
  report: MemberActivityReport | MembersListReport | SettingsReport;
  type: 'memberActivity' | 'membersList' | 'settings';
  receivedAt: Date;
};

class ApplyPendinyPendingClanReportsJob extends Job<undefined> {
  async execute() {
    const memberActivityReports = await this.db
      .createQueryBuilder(MemberActivityReport, 'report')
      .where('report.appliedAt IS NULL')
      .orderBy('report.receivedAt', 'ASC')
      .getMany();

    const latestMembersListReport = await this.db
      .createQueryBuilder(MembersListReport, 'report')
      .where('report.appliedAt IS NULL')
      .orderBy('report.receivedAt', 'DESC')
      .getOne();

    const latestSettingsReport = await this.db
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
      ...(latestMembersListReport
        ? [
            {
              report: latestMembersListReport,
              type: 'membersList' as ReportEntry['type'],
              receivedAt: latestMembersListReport.receivedAt,
            },
          ]
        : []),
      ...(latestSettingsReport
        ? [
            {
              report: latestSettingsReport,
              type: 'settings' as ReportEntry['type'],
              receivedAt: latestSettingsReport.receivedAt,
            },
          ]
        : []),
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
