import { join } from 'node:path';

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { EnvironmentVariables } from '../config/env.interface';
import { readEnvironment } from '../config/env.helper';
import { databaseEntities } from './database-entities';

const migrationPaths = [join(__dirname, 'migrations', '*{.ts,.js}')];

export function getTypeOrmDataSourceOptions(): DataSourceOptions {
  const env = readEnvironment();

  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: false,
    logging: env.NODE_ENV === 'development',
    entities: databaseEntities,
    migrations: migrationPaths,
    migrationsTableName: 'migrations',
  };
}

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', { infer: true }),
    port: configService.get('DB_PORT', { infer: true }),
    username: configService.get('DB_USERNAME', { infer: true }),
    password: configService.get('DB_PASSWORD', { infer: true }),
    database: configService.get('DB_NAME', { infer: true }),
    synchronize: false,
    autoLoadEntities: true,
    logging: configService.get('NODE_ENV', { infer: true }) === 'development',
    retryAttempts: 3,
    retryDelay: 3000,
  }),
};
