import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HarvestCrop } from '@/modules/agriculture/entities/harvest-crop.entity';
import { Harvest } from '@/modules/agriculture/entities/harvest.entity';
import { CropsModule } from '@/modules/crops/crops.module';
import { FarmsModule } from '@/modules/farms/farms.module';
import { HARVEST_CROPS_REPOSITORY } from '@/modules/harvests/application/ports/harvest-crops.repository';
import { HARVESTS_REPOSITORY } from '@/modules/harvests/application/ports/harvests.repository';
import { HarvestsService } from '@/modules/harvests/application/services/harvests.service';
import { TypeOrmHarvestCropsRepository } from '@/modules/harvests/infrastructure/persistence/typeorm/typeorm-harvest-crops.repository';
import { TypeOrmHarvestsRepository } from '@/modules/harvests/infrastructure/persistence/typeorm/typeorm-harvests.repository';
import { HarvestsController } from '@/modules/harvests/presentation/http/controllers/harvests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, HarvestCrop]), FarmsModule, CropsModule],
  controllers: [HarvestsController],
  providers: [
    HarvestsService,
    TypeOrmHarvestsRepository,
    TypeOrmHarvestCropsRepository,
    {
      provide: HARVESTS_REPOSITORY,
      useExisting: TypeOrmHarvestsRepository,
    },
    {
      provide: HARVEST_CROPS_REPOSITORY,
      useExisting: TypeOrmHarvestCropsRepository,
    },
  ],
  exports: [HarvestsService, HARVESTS_REPOSITORY, HARVEST_CROPS_REPOSITORY],
})
export class HarvestsModule {}
