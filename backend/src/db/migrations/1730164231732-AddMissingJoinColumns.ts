import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingJoinColumns1730164231732 implements MigrationInterface {
    name = 'AddMissingJoinColumns1730164231732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20"`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ALTER COLUMN "clanId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_bddd41a59b31496ce79b166693d"`);
        await queryRunner.query(`ALTER TABLE "settings_report" ALTER COLUMN "clanId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings_report" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_0397088aca7b145bf880c42a309"`);
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49"`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ALTER COLUMN "clanId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_bddd41a59b31496ce79b166693d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_0397088aca7b145bf880c42a309" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49"`);
        await queryRunner.query(`ALTER TABLE "members_list_report" DROP CONSTRAINT "FK_0397088aca7b145bf880c42a309"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_bddd41a59b31496ce79b166693d"`);
        await queryRunner.query(`ALTER TABLE "settings_report" DROP CONSTRAINT "FK_1441909acd90d60fe3d63d892f6"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996"`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" DROP CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20"`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ALTER COLUMN "clanId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_01e951b09a20d41e5783fa9fb49" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "members_list_report" ADD CONSTRAINT "FK_0397088aca7b145bf880c42a309" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings_report" ALTER COLUMN "clanId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_bddd41a59b31496ce79b166693d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "settings_report" ADD CONSTRAINT "FK_1441909acd90d60fe3d63d892f6" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ALTER COLUMN "clanId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_bd19f91c144a7db147e7c7f2996" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_activity_report" ADD CONSTRAINT "FK_b5a88e02008b68d09bd79c6f013" FOREIGN KEY ("clanId") REFERENCES "clan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "credentials" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
