import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Producer } from '@/modules/agriculture/entities/producer.entity';
import { PRODUCERS_REPOSITORY } from '@/modules/producers/application/ports/producers.repository';
import { ProducersService } from '@/modules/producers/application/services/producers.service';
import { TypeOrmProducersRepository } from '@/modules/producers/infrastructure/persistence/typeorm/typeorm-producers.repository';
import { ProducersController } from '@/modules/producers/presentation/http/controllers/producers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    TypeOrmProducersRepository,
    {
      provide: PRODUCERS_REPOSITORY,
      useExisting: TypeOrmProducersRepository,
    },
  ],
  exports: [ProducersService, PRODUCERS_REPOSITORY],
})
export class ProducersModule {}
