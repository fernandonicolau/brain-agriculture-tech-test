import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HarvestCrop } from '@/modules/agriculture/entities/harvest-crop.entity';
import { HarvestCropsRepositoryPort } from '@/modules/harvests/application/ports/harvest-crops.repository';

@Injectable()
export class TypeOrmHarvestCropsRepository implements HarvestCropsRepositoryPort {
  constructor(
    @InjectRepository(HarvestCrop)
    private readonly repository: Repository<HarvestCrop>,
  ) {}

  create(data: Partial<HarvestCrop>): HarvestCrop {
    return this.repository.create(data);
  }

  save(harvestCrop: HarvestCrop): Promise<HarvestCrop> {
    return this.repository.save(harvestCrop);
  }

  findByHarvestIdAndCropId(harvestId: string, cropId: string): Promise<HarvestCrop | null> {
    return this.repository.findOne({
      where: { harvestId, cropId },
    });
  }

  async remove(harvestCrop: HarvestCrop): Promise<void> {
    await this.repository.remove(harvestCrop);
  }
}
