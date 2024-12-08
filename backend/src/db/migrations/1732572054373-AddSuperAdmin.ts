import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperAdmin1732572054373 implements MigrationInterface {
  name = 'AddSuperAdmin1732572054373';
  superAdmins = ['raph.pion@gmail.com'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isSuperAdmin" boolean NOT NULL DEFAULT false`,
    );

    queryRunner.startTransaction();
    try {
      for (const email of this.superAdmins) {
        await queryRunner.query(
          `UPDATE "user" SET "isSuperAdmin" = true WHERE "email" = $1`,
          [email],
        );
      }
      queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isSuperAdmin"`);
  }
}

