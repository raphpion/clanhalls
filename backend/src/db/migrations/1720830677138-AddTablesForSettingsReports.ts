import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesForSettingsReports1720830677138 implements MigrationInterface {
    name = 'AddTablesForSettingsReports1720830677138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clan_rank" ("id" SERIAL NOT NULL, "rank" character varying NOT NULL, "title" character varying NOT NULL, "clanId" integer, CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb" UNIQUE ("rank", "clanId"), CONSTRAINT "PK_e4b1817b754a869e5333fb62ba8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings_report" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, "clanId" integer, "userId" integer, CONSTRAINT "UQ_d2332054aee6b2bdd9c0f962659" UNIQUE ("uuid"), CONSTRAINT "PK_1dce93784b5847e76c835e33be0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "FK_79e5a498c1f0657a97b047265b9" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_bddd41a59b31496ce79b166693d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_bddd41a59b31496ce79b166693d"`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "FK_79e5a498c1f0657a97b047265b9"`);
        await queryRunner.query(`DROP TABLE "settings_report"`);
        await queryRunner.query(`DROP TABLE "clan_rank"`);
    }

}
