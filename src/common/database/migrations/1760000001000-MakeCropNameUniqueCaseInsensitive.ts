import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCropNameUniqueCaseInsensitive1760000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('crops', 'UQ_crops_name');

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_crops_name_lower"
      ON "crops" (LOWER("name"))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."UQ_crops_name_lower"');

    await queryRunner.query(`
      ALTER TABLE "crops"
      ADD CONSTRAINT "UQ_crops_name" UNIQUE ("name")
    `);
  }
}
