import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Verifica a saude da aplicacao',
  })
  @ApiQuery({
    name: 'checkDatabase',
    required: false,
    type: Boolean,
    description: 'Executa uma verificacao simples de conexao com o PostgreSQL.',
  })
  @ApiOkResponse({
    description: 'Aplicacao disponivel e respondendo normalmente.',
    type: HealthResponseDto,
  })
  @Get()
  @Version('1')
  check(@Query('checkDatabase') checkDatabase?: string): Promise<HealthResponseDto> {
    return this.healthService.check(checkDatabase === 'true');
  }

  @ApiOperation({
    summary: 'Liveness probe da aplicacao',
  })
  @ApiOkResponse({
    description: 'Processo da API esta ativo.',
    type: HealthResponseDto,
  })
  @Get('live')
  @Version('1')
  live(): Promise<HealthResponseDto> {
    return this.healthService.liveness();
  }

  @ApiOperation({
    summary: 'Readiness probe da aplicacao',
  })
  @ApiOkResponse({
    description: 'Aplicacao pronta para receber trafego.',
    type: HealthResponseDto,
  })
  @Get('ready')
  @Version('1')
  ready(): Promise<HealthResponseDto> {
    return this.healthService.readiness();
  }
}
