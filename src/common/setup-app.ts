import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './config/env.interface';
import { HttpExceptionFilter } from './http/filters/http-exception.filter';
import { LoggingInterceptor } from './http/interceptors/logging.interceptor';
import { AppLogger } from './logging/app-logger';
import { setupSwagger } from './swagger/swagger.config';

export function setupApplication(app: INestApplication): void {
  let environment = process.env.NODE_ENV ?? 'development';

  try {
    const configService = app.get(ConfigService<EnvironmentVariables, true>);
    environment = configService.get('NODE_ENV', { infer: true });
  } catch {
    environment = process.env.NODE_ENV ?? 'development';
  }

  const appLogger = new AppLogger();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(appLogger, environment));
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger, environment));

  setupSwagger(app);
}
