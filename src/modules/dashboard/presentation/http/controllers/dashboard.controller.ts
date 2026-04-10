import { Controller, Get, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DashboardService } from '@/modules/dashboard/application/services/dashboard.service';
import { DashboardResponseDto } from '@/modules/dashboard/presentation/http/dto/dashboard-response.dto';
import { DashboardHttpMapper } from '@/modules/dashboard/presentation/http/mappers/dashboard-http.mapper';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Retorna os dados agregados para o dashboard',
  })
  @ApiOkResponse({
    type: DashboardResponseDto,
  })
  getSummary(): Promise<DashboardResponseDto> {
    return this.dashboardService
      .getSummary()
      .then((result) => DashboardHttpMapper.toResponse(result));
  }
}
