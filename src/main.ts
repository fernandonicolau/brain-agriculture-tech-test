import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './common/config/env.interface';
import { setupApplication } from './common/setup-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  setupApplication(app);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port);
}

void bootstrap();
