import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToClanAssociations1728348810674 implements MigrationInterface {
    name = 'AddCascadeToClanAssociations1728348810674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51"`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "FK_79e5a498c1f0657a97b047265b9"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "lastSeenAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "FK_79e5a498c1f0657a97b047265b9" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`);
        await queryRunner.query(`ALTER TABLE "clan_rank" DROP CONSTRAINT "FK_79e5a498c1f0657a97b047265b9"`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c"`);
        await queryRunner.query(`ALTER TABLE "clan_player" DROP CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "lastSeenAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_rank" ADD CONSTRAINT "FK_79e5a498c1f0657a97b047265b9" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_e6c0e34a63a874d1ddfc5f1062c" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clan_player" ADD CONSTRAINT "FK_daac99e9d2f3a6e0d312cc94f51" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
