import { Controller, Get, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({
    summary: 'Verifica a saúde da aplicação',
  })
  @ApiOkResponse({
    description: 'Aplicação disponível e respondendo normalmente.',
    type: HealthResponseDto,
  })
  @Get()
  @Version('1')
  check(): HealthResponseDto {
    return {
      status: 'ok',
      service: 'brain-agriculture-api',
      timestamp: new Date().toISOString(),
    };
  }
}
