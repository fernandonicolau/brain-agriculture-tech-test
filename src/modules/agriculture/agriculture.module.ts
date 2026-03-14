import { Module } from '@nestjs/common';

import { CropsModule } from '../crops/crops.module';
import { FarmsModule } from '../farms/farms.module';
import { HarvestsModule } from '../harvests/harvests.module';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [ProducersModule, FarmsModule, CropsModule, HarvestsModule],
  exports: [ProducersModule, FarmsModule, CropsModule, HarvestsModule],
})
export class AgricultureModule {}
