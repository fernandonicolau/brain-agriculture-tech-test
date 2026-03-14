import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farm } from '../agriculture/entities/farm.entity';
import { HarvestCrop } from '../agriculture/entities/harvest-crop.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, HarvestCrop])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
