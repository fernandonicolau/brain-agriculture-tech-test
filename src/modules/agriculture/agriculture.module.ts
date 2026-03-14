import { Module } from '@nestjs/common';

import { FarmsModule } from '../farms/farms.module';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [ProducersModule, FarmsModule],
  exports: [ProducersModule, FarmsModule],
})
export class AgricultureModule {}
