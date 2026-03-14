import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';

import { HttpExceptionFilter } from './http/filters/http-exception.filter';
import { LoggingInterceptor } from './http/interceptors/logging.interceptor';
import { setupSwagger } from './swagger/swagger.config';

export function setupApplication(app: INestApplication): void {
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

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app);
}
