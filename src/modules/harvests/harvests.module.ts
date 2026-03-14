import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Crop } from '../agriculture/entities/crop.entity';
import { HarvestCrop } from '../agriculture/entities/harvest-crop.entity';
import { Harvest } from '../agriculture/entities/harvest.entity';
import { CropsModule } from '../crops/crops.module';
import { FarmsModule } from '../farms/farms.module';
import { HarvestCropsRepository } from './harvest-crops.repository';
import { HarvestsController } from './harvests.controller';
import { HarvestsRepository } from './harvests.repository';
import { HarvestsService } from './harvests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, HarvestCrop, Crop]), FarmsModule, CropsModule],
  controllers: [HarvestsController],
  providers: [HarvestsRepository, HarvestCropsRepository, HarvestsService],
  exports: [HarvestsService],
})
export class HarvestsModule {}
