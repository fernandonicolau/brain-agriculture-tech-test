import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';

type HealthResponse = {
  status: 'ok';
  service: 'brain-agriculture-api';
  timestamp: string;
};

@Controller('health')
export class HealthController {
  @Get()
  @Version(VERSION_NEUTRAL)
  check(): HealthResponse {
    return {
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
    };
  }
}
