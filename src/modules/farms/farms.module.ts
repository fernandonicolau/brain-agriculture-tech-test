import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farm } from '../agriculture/entities/farm.entity';
import { ProducersModule } from '../producers/producers.module';
import { FarmsController } from './farms.controller';
import { FarmsRepository } from './farms.repository';
import { FarmsService } from './farms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducersModule],
  controllers: [FarmsController],
  providers: [FarmsRepository, FarmsService],
  exports: [FarmsRepository, FarmsService],
})
export class FarmsModule {}
