import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClanTables1720751823417 implements MigrationInterface {
    name = 'AddClanTables1720751823417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clan_user" ("clanId" integer NOT NULL, "userId" integer NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_016e173c4cd2caa66460f12658a" PRIMARY KEY ("clanId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "clan" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "nameNormalized" character varying(255) NOT NULL, CONSTRAINT "UQ_4fafa7d5c020e8731031dd720c4" UNIQUE ("uuid"), CONSTRAINT "UQ_b394039ff70f0dfb0b89ec51238" UNIQUE ("name"), CONSTRAINT "UQ_fd047331bab22cfcad9ab8ca26d" UNIQUE ("nameNormalized"), CONSTRAINT "PK_25593abe237e38783ed2e91838f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_1b08433fbb3933ea30477b184c4" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_user" ADD CONSTRAINT "FK_dafa714bc802cd2356c43d655f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_dafa714bc802cd2356c43d655f8"`);
        await queryRunner.query(`ALTER TABLE "clan_user" DROP CONSTRAINT "FK_1b08433fbb3933ea30477b184c4"`);
        await queryRunner.query(`DROP TABLE "clan"`);
        await queryRunner.query(`DROP TABLE "clan_user"`);
    }

}
