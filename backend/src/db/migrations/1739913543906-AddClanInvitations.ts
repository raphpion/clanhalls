import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClanInvitations1739913543906 implements MigrationInterface {
  name = 'AddClanInvitations1739913543906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clan_invitation" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying, "clanId" integer NOT NULL, "senderId" integer NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE, "disabledAt" TIMESTAMP WITH TIME ZONE, "maxUses" integer, "uses" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_5d25cf2d8a31db0a9de9a2db1ea" UNIQUE ("uuid"), CONSTRAINT "PK_c82a75feb2240f4579b7221fe5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" ADD "clanInvitationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" ADD CONSTRAINT "FK_e7e56f0ba78fc4dce7139d14d03" FOREIGN KEY ("clanInvitationId") REFERENCES "clan_invitation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_invitation" ADD CONSTRAINT "FK_010c27df7e2f8c00af62bd0651b" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_invitation" ADD CONSTRAINT "FK_518c0ff80ec48f42395ab794fc9" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clan_invitation" DROP CONSTRAINT "FK_518c0ff80ec48f42395ab794fc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_invitation" DROP CONSTRAINT "FK_010c27df7e2f8c00af62bd0651b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" DROP CONSTRAINT "FK_e7e56f0ba78fc4dce7139d14d03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" DROP COLUMN "clanInvitationId"`,
    );
    await queryRunner.query(`DROP TABLE "clan_invitation"`);
  }
}

