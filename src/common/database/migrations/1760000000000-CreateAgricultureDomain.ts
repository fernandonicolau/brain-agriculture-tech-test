import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateAgricultureDomain1760000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'producers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'document',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'producers',
      new TableUnique({
        name: 'UQ_producers_document',
        columnNames: ['document'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'farms',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'producer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'char',
            length: '2',
            isNullable: false,
          },
          {
            name: 'total_area',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'arable_area',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'vegetation_area',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createCheckConstraint(
      'farms',
      new TableCheck({
        name: 'CHK_farms_area_usage',
        expression:
          '"arable_area" >= 0 AND "vegetation_area" >= 0 AND "total_area" >= ("arable_area" + "vegetation_area")',
      }),
    );

    await queryRunner.createIndex(
      'farms',
      new TableIndex({
        name: 'IDX_farms_state',
        columnNames: ['state'],
      }),
    );

    await queryRunner.createIndex(
      'farms',
      new TableIndex({
        name: 'IDX_farms_producer_id',
        columnNames: ['producer_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'farms',
      new TableForeignKey({
        name: 'FK_farms_producer_id',
        columnNames: ['producer_id'],
        referencedTableName: 'producers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'harvests',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'farm_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'harvests',
      new TableIndex({
        name: 'IDX_harvests_farm_id',
        columnNames: ['farm_id'],
      }),
    );

    await queryRunner.createIndex(
      'harvests',
      new TableIndex({
        name: 'IDX_harvests_year',
        columnNames: ['year'],
      }),
    );

    await queryRunner.createForeignKey(
      'harvests',
      new TableForeignKey({
        name: 'FK_harvests_farm_id',
        columnNames: ['farm_id'],
        referencedTableName: 'farms',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'crops',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'crops',
      new TableUnique({
        name: 'UQ_crops_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'harvest_crops',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'harvest_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'crop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'harvest_crops',
      new TableUnique({
        name: 'UQ_harvest_crops_harvest_id_crop_id',
        columnNames: ['harvest_id', 'crop_id'],
      }),
    );

    await queryRunner.createIndex(
      'harvest_crops',
      new TableIndex({
        name: 'IDX_harvest_crops_harvest_id',
        columnNames: ['harvest_id'],
      }),
    );

    await queryRunner.createIndex(
      'harvest_crops',
      new TableIndex({
        name: 'IDX_harvest_crops_crop_id',
        columnNames: ['crop_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'harvest_crops',
      new TableForeignKey({
        name: 'FK_harvest_crops_harvest_id',
        columnNames: ['harvest_id'],
        referencedTableName: 'harvests',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'harvest_crops',
      new TableForeignKey({
        name: 'FK_harvest_crops_crop_id',
        columnNames: ['crop_id'],
        referencedTableName: 'crops',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('harvest_crops', 'FK_harvest_crops_crop_id');
    await queryRunner.dropForeignKey('harvest_crops', 'FK_harvest_crops_harvest_id');
    await queryRunner.dropIndex('harvest_crops', 'IDX_harvest_crops_crop_id');
    await queryRunner.dropIndex('harvest_crops', 'IDX_harvest_crops_harvest_id');
    await queryRunner.dropUniqueConstraint('harvest_crops', 'UQ_harvest_crops_harvest_id_crop_id');
    await queryRunner.dropTable('harvest_crops');

    await queryRunner.dropUniqueConstraint('crops', 'UQ_crops_name');
    await queryRunner.dropTable('crops');

    await queryRunner.dropForeignKey('harvests', 'FK_harvests_farm_id');
    await queryRunner.dropIndex('harvests', 'IDX_harvests_year');
    await queryRunner.dropIndex('harvests', 'IDX_harvests_farm_id');
    await queryRunner.dropTable('harvests');

    await queryRunner.dropForeignKey('farms', 'FK_farms_producer_id');
    await queryRunner.dropIndex('farms', 'IDX_farms_producer_id');
    await queryRunner.dropIndex('farms', 'IDX_farms_state');
    await queryRunner.dropCheckConstraint('farms', 'CHK_farms_area_usage');
    await queryRunner.dropTable('farms');

    await queryRunner.dropUniqueConstraint('producers', 'UQ_producers_document');
    await queryRunner.dropTable('producers');
  }
}
