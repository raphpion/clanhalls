import { MigrationInterface, QueryRunner } from "typeorm";

export class RuneLiteSupportArbitraryNumberOfRanks1731733354897 implements MigrationInterface {
    name = 'RuneLiteSupportArbitraryNumberOfRanks1731733354897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_player" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD "rank" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_79e5a498c1f0657a97b047265b9" PRIMARY KEY ("clanId")`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD "rank" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_79e5a498c1f0657a97b047265b9"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb" PRIMARY KEY ("clanId", "rank")`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb" UNIQUE ("rank", "clanId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_79e5a498c1f0657a97b047265b9" PRIMARY KEY ("clanId")`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD "rank" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_79e5a498c1f0657a97b047265b9"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb" PRIMARY KEY ("clanId", "rank")`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "UQ_49035ca666d89a0df04aa4aeddb" UNIQUE ("clanId", "rank")`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD "rank" character varying NOT NULL`);
    }

}
