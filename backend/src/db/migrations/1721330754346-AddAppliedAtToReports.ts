import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppliedAtToReports1721330754346 implements MigrationInterface {
    name = 'AddAppliedAtToReports1721330754346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD "appliedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD "appliedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings_report" DROP COLUMN "appliedAt"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP COLUMN "appliedAt"`);
    }

}
