import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { appConfig } from './common/config/app.config';
import { databaseConfig } from './common/config/database.config';
import { isTestEnvironment } from './common/config/env.helper';
import { typeOrmModuleOptions } from './common/database/typeorm.config';
import { HealthModule } from './modules/health/health.module';

const infrastructureModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    envFilePath: ['.env'],
    load: [appConfig, databaseConfig],
  }),
  ...(!isTestEnvironment() ? [TypeOrmModule.forRootAsync(typeOrmModuleOptions)] : []),
  HealthModule,
];

@Module({
  imports: infrastructureModules,
})
export class AppModule {}
