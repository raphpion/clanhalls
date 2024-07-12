import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesForMemberActivityReports1720817996025 implements MigrationInterface {
    name = 'AddTablesForMemberActivityReports1720817996025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_1b08433fbb3933ea30477b184c4"`);
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_dafa714bc802cd2356c43d655f8"`);
        await queryRunner.query(`CREATE TABLE "credentials" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "clientId" character varying NOT NULL, "clientSecretHash" character varying NOT NULL, "scope" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_b2afc4579bbea927240a17119f7" UNIQUE ("clientId"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clan_player" ("clanId" integer NOT NULL, "playerId" integer NOT NULL, "lastSeenAt" TIMESTAMP NOT NULL, "rank" character varying NOT NULL, CONSTRAINT "PK_eb6bd76df8684e9e26e48aa89a7" PRIMARY KEY ("clanId", "playerId"))`);
        await queryRunner.query(`CREATE TABLE "member_activity_report" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, CONSTRAINT "UQ_d578303e8fded30bc733e040181" UNIQUE ("uuid"), CONSTRAINT "PK_07f3197688b196a9c0431bd92f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(12) NOT NULL, "previousUsername" character varying(12), "usernameChangedAt" TIMESTAMP, CONSTRAINT "UQ_d361920f8c6a8ea7950a34e0200" UNIQUE ("uuid"), CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_1b08433fbb3933ea30477b184c4" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_dafa714bc802cd2356c43d655f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_dafa714bc802cd2356c43d655f8"`);
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_1b08433fbb3933ea30477b184c4"`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c"`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "member_activity_report"`);
        await queryRunner.query(`DROP TABLE "clan_player"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_dafa714bc802cd2356c43d655f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_1b08433fbb3933ea30477b184c4" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
