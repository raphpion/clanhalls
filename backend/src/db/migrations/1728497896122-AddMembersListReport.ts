import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMembersListReport1728497896122 implements MigrationInterface {
    name = 'AddMembersListReport1728497896122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members_list_report" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "appliedAt" TIMESTAMP, "data" jsonb NOT NULL, "clanId" integer, "userId" integer, CONSTRAINT "UQ_00db8a1862bcbea9024e23e918a" UNIQUE ("uuid"), CONSTRAINT "PK_5975078743f4e75d50c6fd1f21b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_0397088aca7b145bf880c42a309" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49"`);
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_0397088aca7b145bf880c42a309"`);
        await queryRunner.query(`DROP TABLE "members_list_report"`);
    }

}
