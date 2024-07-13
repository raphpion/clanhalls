import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConstraintsForActivityReports1720827278884 implements MigrationInterface {
    name = 'UpdateConstraintsForActivityReports1720827278884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD "clanId" integer`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP COLUMN "clanId"`);
    }

}
