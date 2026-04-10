import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { getTypeOrmDataSourceOptions } from '@/common/database/typeorm.config';

async function runMigrations(): Promise<void> {
  const dataSource = new DataSource(getTypeOrmDataSourceOptions());

  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('Migrations executed successfully.');
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void runMigrations();
