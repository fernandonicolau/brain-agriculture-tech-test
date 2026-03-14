import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Verifica a saúde da aplicação',
  })
  @ApiQuery({
    name: 'checkDatabase',
    required: false,
    type: Boolean,
    description: 'Executa uma verificação simples de conexão com o PostgreSQL.',
  })
  @ApiOkResponse({
    description: 'Aplicação disponível e respondendo normalmente.',
    type: HealthResponseDto,
  })
  @Get()
  @Version('1')
  check(@Query('checkDatabase') checkDatabase?: string): Promise<HealthResponseDto> {
    return this.healthService.check(checkDatabase === 'true');
  }
}
