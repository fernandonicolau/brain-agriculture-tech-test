import { Module } from '@nestjs/common';

import { CropsModule } from '@/modules/crops/crops.module';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { FarmsModule } from '@/modules/farms/farms.module';
import { HarvestsModule } from '@/modules/harvests/harvests.module';
import { ProducersModule } from '@/modules/producers/producers.module';

@Module({
  imports: [ProducersModule, FarmsModule, CropsModule, HarvestsModule, DashboardModule],
  exports: [ProducersModule, FarmsModule, CropsModule, HarvestsModule, DashboardModule],
})
export class AgricultureModule {}
