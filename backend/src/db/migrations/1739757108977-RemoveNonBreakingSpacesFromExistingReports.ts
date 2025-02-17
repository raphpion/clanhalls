import { MigrationInterface, QueryRunner } from 'typeorm';
import MembersListReport from '../../clans/reports/membersListReport';

export class RemoveNonBreakingSpacesFromExistingReports1739757108977
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const concernedClans: { clanId: number }[] = await queryRunner.query(
      `
      SELECT DISTINCT "clanId"
      FROM "members_list_report"
      WHERE data::text LIKE '% %';
      `,
    );

    if (concernedClans.length === 0) return;

    const clanIds = concernedClans.map((c) => c.clanId);

    await queryRunner.query(
      `
      UPDATE "members_list_report"
      SET data = regexp_replace(data::text, ' ', ' ', 'g')::jsonb
      WHERE "clanId" = ANY($1);
      `,
      [clanIds],
    );

    await queryRunner.query(
      `
      UPDATE "member_activity_report"
      SET "appliedAt" = NULL
      WHERE "clanId" = ANY($1);
      `,
      [clanIds],
    );
  }

  public async down(_: QueryRunner): Promise<void> {
    // No rollback as this is a data migration
  }
}

