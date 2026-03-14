import { Controller, Get, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardService } from './dashboard.service';

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
    return this.dashboardService.getSummary();
  }
}
