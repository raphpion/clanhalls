import { MigrationInterface, QueryRunner } from 'typeorm';

export class UseTimestampsWithTimeZone1734365368926
  implements MigrationInterface
{
  name = 'UseTimestampsWithTimeZone1734365368926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clan_player" ALTER COLUMN "lastSeenAt" TYPE TIMESTAMP WITH TIME ZONE USING "lastSeenAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP WITH TIME ZONE USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP WITH TIME ZONE USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP WITH TIME ZONE USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP WITH TIME ZONE USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE USING "updatedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan" ALTER COLUMN "lastSyncedAt" TYPE TIMESTAMP WITH TIME ZONE USING "lastSyncedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "members_list_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP WITH TIME ZONE USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "members_list_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP WITH TIME ZONE USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "members_list_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "members_list_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan" ALTER COLUMN "lastSyncedAt" TYPE TIMESTAMP USING "lastSyncedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING "updatedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ALTER COLUMN "appliedAt" TYPE TIMESTAMP USING "appliedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ALTER COLUMN "receivedAt" TYPE TIMESTAMP USING "receivedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_player" ALTER COLUMN "lastSeenAt" TYPE TIMESTAMP USING "lastSeenAt" AT TIME ZONE 'UTC'`,
    );
  }
}

