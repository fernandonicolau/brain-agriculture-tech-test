import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HarvestCrop } from '../agriculture/entities/harvest-crop.entity';

@Injectable()
export class HarvestCropsRepository {
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
