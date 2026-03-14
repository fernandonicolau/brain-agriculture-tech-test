import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Producer } from '../agriculture/entities/producer.entity';
import { ProducersController } from './producers.controller';
import { ProducersRepository } from './producers.repository';
import { ProducersService } from './producers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducersController],
  providers: [ProducersRepository, ProducersService],
  exports: [ProducersRepository, ProducersService],
})
export class ProducersModule {}
