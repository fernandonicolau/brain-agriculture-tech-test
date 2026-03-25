import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farm } from '@/modules/agriculture/entities/farm.entity';
import { HarvestCrop } from '@/modules/agriculture/entities/harvest-crop.entity';
import { DASHBOARD_SUMMARY_REPOSITORY } from '@/modules/dashboard/application/ports/dashboard-summary.repository';
import { DashboardService } from '@/modules/dashboard/application/services/dashboard.service';
import { TypeOrmDashboardSummaryRepository } from '@/modules/dashboard/infrastructure/persistence/typeorm/typeorm-dashboard-summary.repository';
import { DashboardController } from '@/modules/dashboard/presentation/http/controllers/dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, HarvestCrop])],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    TypeOrmDashboardSummaryRepository,
    {
      provide: DASHBOARD_SUMMARY_REPOSITORY,
      useExisting: TypeOrmDashboardSummaryRepository,
    },
  ],
})
export class DashboardModule {}
