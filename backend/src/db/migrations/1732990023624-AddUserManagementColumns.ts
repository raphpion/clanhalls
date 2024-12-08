import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserManagementColumns1732990023624
  implements MigrationInterface
{
  name = 'AddUserManagementColumns1732990023624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "createdBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_82319f64187836b307e6d6ba08d" UNIQUE ("createdBy")`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_a19025a009be58684a63961aaf3" UNIQUE ("updatedBy")`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "disabledAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_82319f64187836b307e6d6ba08d" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_a19025a009be58684a63961aaf3" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`UPDATE "user" SET "createdBy" = "id"`);
    await queryRunner.query(`UPDATE "user" SET "updatedBy" = "id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_a19025a009be58684a63961aaf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_82319f64187836b307e6d6ba08d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "disabledAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_a19025a009be58684a63961aaf3"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_82319f64187836b307e6d6ba08d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
  }
}

