import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPictureUrl1721856818531 implements MigrationInterface {
    name = 'AddUserPictureUrl1721856818531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pictureUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pictureUrl"`);
    }

}
