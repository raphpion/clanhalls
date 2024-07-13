import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClanRankJoinColumnForSettingsReports1720842288926 implements MigrationInterface {
    name = 'AddClanRankJoinColumnForSettingsReports1720842288926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan" ADD "nameInGame" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan" DROP COLUMN "nameInGame"`);
    }

}
