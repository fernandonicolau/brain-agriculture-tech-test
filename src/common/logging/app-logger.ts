import { Logger } from '@nestjs/common';

type RequestLogPayload = {
  environment: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
};

type ErrorLogPayload = RequestLogPayload & {
  message: string;
  errorName: string;
};

type StartupLogPayload = {
  environment: string;
  port: number;
};

export class AppLogger {
  private readonly logger = new Logger('App');

  logRequest(payload: RequestLogPayload): void {
    this.logger.log(this.format('request.completed', payload));
  }

  logError(payload: ErrorLogPayload, trace?: string): void {
    this.logger.error(this.format('request.failed', payload), trace);
  }

  logStartup(payload: StartupLogPayload): void {
    this.logger.log(this.format('application.started', payload));
  }

  private format(event: string, payload: Record<string, string | number>): string {
    const attributes = Object.entries(payload)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    return `event=${event} ${attributes}`;
  }
}
