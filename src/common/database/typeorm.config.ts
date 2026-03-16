import { join } from 'node:path';

import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { readEnvironment } from '../config/env.helper';
import { databaseEntities } from './database-entities';

const migrationPaths = [join(__dirname, 'migrations', '*{.ts,.js}')];

function getDatabaseConnectionOptions() {
  const env = readEnvironment();

  return {
    ...(env.DATABASE_URL
      ? {
          url: env.DATABASE_URL,
        }
      : {
          host: env.DB_HOST,
          port: env.DB_PORT,
          username: env.DB_USERNAME,
          password: env.DB_PASSWORD,
          database: env.DB_NAME,
        }),
    logging: env.NODE_ENV === 'development',
  };
}

export function getTypeOrmDataSourceOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    ...getDatabaseConnectionOptions(),
    synchronize: false,
    entities: databaseEntities,
    migrations: migrationPaths,
    migrationsTableName: 'migrations',
  };
}

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    ...getDatabaseConnectionOptions(),
    synchronize: false,
    autoLoadEntities: true,
    retryAttempts: 3,
    retryDelay: 3000,
  }),
};
