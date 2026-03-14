import { Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(
    @Optional()
    @Inject(getDataSourceToken())
    private readonly dataSource?: DataSource,
  ) {}

  async check(checkDatabase = false): Promise<HealthResponseDto> {
    const response: HealthResponseDto = {
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
    };

    if (!checkDatabase) {
      return response;
    }

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
}
