import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farm } from '@/modules/agriculture/entities/farm.entity';
import { FARMS_REPOSITORY } from '@/modules/farms/application/ports/farms.repository';
import { FarmsService } from '@/modules/farms/application/services/farms.service';
import { TypeOrmFarmsRepository } from '@/modules/farms/infrastructure/persistence/typeorm/typeorm-farms.repository';
import { FarmsController } from '@/modules/farms/presentation/http/controllers/farms.controller';
import { ProducersModule } from '@/modules/producers/producers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducersModule],
  controllers: [FarmsController],
  providers: [
    FarmsService,
    TypeOrmFarmsRepository,
    {
      provide: FARMS_REPOSITORY,
      useExisting: TypeOrmFarmsRepository,
    },
  ],
  exports: [FarmsService, FARMS_REPOSITORY],
})
export class FarmsModule {}
