import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppLogger } from '../../logging/app-logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly environment: string,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const responseBody =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown> | null);
    const message = Array.isArray(responseBody?.message)
      ? responseBody.message.join(', ')
      : String(responseBody?.message ?? 'Internal server error');
    const errorName = String(
      responseBody?.error ?? (isHttpException ? exception.name : 'InternalServerError'),
    );

    this.appLogger.logError(
      {
        environment: this.environment,
        method: request.method,
        path: request.originalUrl,
        statusCode,
        durationMs: 0,
        message,
        errorName,
      },
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}
