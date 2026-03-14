import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AppLogger } from '../../logging/app-logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly environment: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const startedAt = Date.now();
    const { method, originalUrl } = request;

    return next.handle().pipe(
      finalize(() => {
        this.appLogger.logRequest({
          environment: this.environment,
          method,
          path: originalUrl,
          statusCode: Number(response.statusCode),
          durationMs: Date.now() - startedAt,
        });
      }),
    );
  }
}
