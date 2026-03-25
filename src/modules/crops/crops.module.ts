import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Crop } from '@/modules/agriculture/entities/crop.entity';
import { CROPS_REPOSITORY } from '@/modules/crops/application/ports/crops.repository';
import { CropsService } from '@/modules/crops/application/services/crops.service';
import { TypeOrmCropsRepository } from '@/modules/crops/infrastructure/persistence/typeorm/typeorm-crops.repository';
import { CropsController } from '@/modules/crops/presentation/http/controllers/crops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crop])],
  controllers: [CropsController],
  providers: [
    CropsService,
    TypeOrmCropsRepository,
    {
      provide: CROPS_REPOSITORY,
      useExisting: TypeOrmCropsRepository,
    },
  ],
  exports: [CropsService, CROPS_REPOSITORY],
})
export class CropsModule {}
