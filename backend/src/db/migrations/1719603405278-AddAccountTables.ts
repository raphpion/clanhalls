import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountTables1719603405278 implements MigrationInterface {
  name = 'AddAccountTables1719603405278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionID" character varying(255) NOT NULL, "method" character varying(255) NOT NULL DEFAULT 'credentials', "ipAddress" character varying(64) NOT NULL, "userAgent" character varying(255) NOT NULL, "signedOutAt" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_aa8b10fce4746369616ff6a5978" UNIQUE ("uuid"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "googleId" character varying(255) NOT NULL, "username" character varying(25), "email" character varying(255) NOT NULL, "emailNormalized" character varying(255) NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_1889d3aecbe55fcf0c45ab233d4" UNIQUE ("emailNormalized"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "session"`);
  }
}

