import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Crop } from '../agriculture/entities/crop.entity';
import { CropsController } from './crops.controller';
import { CropsRepository } from './crops.repository';
import { CropsService } from './crops.service';

@Module({
  imports: [TypeOrmModule.forFeature([Crop])],
  controllers: [CropsController],
  providers: [CropsRepository, CropsService],
  exports: [CropsRepository, CropsService],
})
export class CropsModule {}
