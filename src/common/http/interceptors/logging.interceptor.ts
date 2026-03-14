import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();
    const { method, originalUrl } = request;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${originalUrl} ${Date.now() - startedAt}ms`);
      }),
      catchError((error: unknown) => {
        this.logger.error(`${method} ${originalUrl} ${Date.now() - startedAt}ms`);

        return throwError(() => error);
      }),
    );
  }
}
