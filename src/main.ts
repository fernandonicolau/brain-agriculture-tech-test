import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/config/env.interface';
import { AppLogger } from './common/logging/app-logger';
import { setupApplication } from './common/setup-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const appLogger = new AppLogger();

  setupApplication(app);

  const port = configService.get('PORT', { infer: true });
  const environment = configService.get('NODE_ENV', { infer: true });

  await app.listen(port);
  appLogger.logStartup({
    environment,
    port,
  });
}

void bootstrap();
