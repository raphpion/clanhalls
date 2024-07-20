import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1721511874210 implements MigrationInterface {
  name = 'InitialMigration1721511874210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "wiseOldManId" integer, "username" character varying(12) NOT NULL, CONSTRAINT "UQ_d361920f8c6a8ea7950a34e0200" UNIQUE ("uuid"), CONSTRAINT "UQ_574eaf3aff925463f0f11cbac87" UNIQUE ("wiseOldManId"), CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "clan_player" ("clanId" integer NOT NULL, "playerId" integer NOT NULL, "lastSeenAt" TIMESTAMP NOT NULL, "rank" character varying NOT NULL, CONSTRAINT "PK_eb6bd76df8684e9e26e48aa89a7" PRIMARY KEY ("clanId", "playerId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "clan_rank" ("id" SERIAL NOT NULL, "clanId" integer NOT NULL, "rank" character varying NOT NULL, "title" character varying NOT NULL, CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb" UNIQUE ("rank", "clanId"), CONSTRAINT "PK_e4b1817b754a869e5333fb62ba8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "credentials" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "clientId" character varying NOT NULL, "clientSecretHash" character varying NOT NULL, "scope" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_b2afc4579bbea927240a17119f7" UNIQUE ("clientId"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "member_activity_report" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "appliedAt" TIMESTAMP, "data" jsonb NOT NULL, "clanId" integer, "userId" integer, CONSTRAINT "UQ_d578303e8fded30bc733e040181" UNIQUE ("uuid"), CONSTRAINT "PK_07f3197688b196a9c0431bd92f2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionID" character varying(255) NOT NULL, "method" character varying(255) NOT NULL DEFAULT 'credentials', "ipAddress" character varying(64) NOT NULL, "userAgent" character varying(255) NOT NULL, "signedOutAt" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_aa8b10fce4746369616ff6a5978" UNIQUE ("uuid"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "googleId" character varying(255) NOT NULL, "username" character varying(25), "usernameNormalized" character varying(25), "email" character varying(255) NOT NULL, "emailNormalized" character varying(255) NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_6d26ced70f0a58c60e01867d898" UNIQUE ("usernameNormalized"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_1889d3aecbe55fcf0c45ab233d4" UNIQUE ("emailNormalized"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "clan_user" ("clanId" integer NOT NULL, "userId" integer NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_016e173c4cd2caa66460f12658a" PRIMARY KEY ("clanId", "userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "clan" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "nameNormalized" character varying(255) NOT NULL, "nameInGame" character varying(20), CONSTRAINT "UQ_4fafa7d5c020e8731031dd720c4" UNIQUE ("uuid"), CONSTRAINT "UQ_b394039ff70f0dfb0b89ec51238" UNIQUE ("name"), CONSTRAINT "UQ_fd047331bab22cfcad9ab8ca26d" UNIQUE ("nameNormalized"), CONSTRAINT "PK_25593abe237e38783ed2e91838f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "settings_report" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "appliedAt" TIMESTAMP, "data" jsonb NOT NULL, "clanId" integer, "userId" integer, CONSTRAINT "UQ_d2332054aee6b2bdd9c0f962659" UNIQUE ("uuid"), CONSTRAINT "PK_1dce93784b5847e76c835e33be0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_player" ADD CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_player" ADD CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_rank" ADD CONSTRAINT "FK_79e5a498c1f0657a97b047265b9" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "credentials" ADD CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" ADD CONSTRAINT "FK_1b08433fbb3933ea30477b184c4" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" ADD CONSTRAINT "FK_dafa714bc802cd2356c43d655f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" ADD CONSTRAINT "FK_bddd41a59b31496ce79b166693d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings_report" DROP CONSTRAINT "FK_bddd41a59b31496ce79b166693d"`
    );
    await queryRunner.query(
      `ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" DROP CONSTRAINT "FK_dafa714bc802cd2356c43d655f8"`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_user" DROP CONSTRAINT "FK_1b08433fbb3933ea30477b184c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996"`
    );
    await queryRunner.query(
      `ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`
    );
    await queryRunner.query(
      `ALTER TABLE "credentials" DROP CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20"`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_rank" DROP CONSTRAINT "FK_79e5a498c1f0657a97b047265b9"`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_player" DROP CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c"`
    );
    await queryRunner.query(
      `ALTER TABLE "clan_player" DROP CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51"`
    );
    await queryRunner.query(`DROP TABLE "settings_report"`);
    await queryRunner.query(`DROP TABLE "clan"`);
    await queryRunner.query(`DROP TABLE "clan_user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "member_activity_report"`);
    await queryRunner.query(`DROP TABLE "credentials"`);
    await queryRunner.query(`DROP TABLE "clan_rank"`);
    await queryRunner.query(`DROP TABLE "clan_player"`);
    await queryRunner.query(`DROP TABLE "player"`);
  }
}

