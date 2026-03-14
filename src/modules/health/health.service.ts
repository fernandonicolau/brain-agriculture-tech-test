import { Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { EnvironmentVariables } from '../../common/config/env.interface';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    @Optional()
    @Inject(getDataSourceToken())
    private readonly dataSource?: DataSource,
  ) {}

  async check(checkDatabase = false): Promise<HealthResponseDto> {
    if (!checkDatabase) {
      return this.liveness();
    }

    return this.readiness();
  }

  async liveness(): Promise<HealthResponseDto> {
    return this.buildBaseResponse();
  }

  async readiness(): Promise<HealthResponseDto> {
    const response = this.buildBaseResponse();

    if (!this.dataSource?.isInitialized) {
      throw new ServiceUnavailableException({
        message: 'Database connection is not available',
        error: 'Service Unavailable',
      });
    }

    await this.dataSource.query('SELECT 1');

    return {
      ...response,
      database: 'up',
    };
  }

  private buildBaseResponse(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV', { infer: true }),
    };
  }
}
