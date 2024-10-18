import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIdFromClanRank1729217887978 implements MigrationInterface {
    name = 'RemoveIdFromClanRank1729217887978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_e4b1817b754a869e5333fb62ba8"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb" PRIMARY KEY ("clanId", "rank")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "PK_49035ca666d89a0df04aa4aeddb"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "PK_e4b1817b754a869e5333fb62ba8" PRIMARY KEY ("id")`);
    }

}
