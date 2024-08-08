import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastSyncedAtToClan1722890522064 implements MigrationInterface {
    name = 'AddLastSyncedAtToClan1722890522064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan" ADD "lastSyncedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan" DROP COLUMN "lastSyncedAt"`);
    }

}
