import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInfoAndExpirationToSession1727895231154 implements MigrationInterface {
    name = 'AddInfoAndExpirationToSession1727895231154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "deviceType" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "os" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "browser" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "location" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expiresAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "lastSeenAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "browser"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "os"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "deviceType"`);
    }

}
