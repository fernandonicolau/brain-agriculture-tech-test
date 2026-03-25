import { HarvestCrop } from '@/modules/agriculture/entities/harvest-crop.entity';

export const HARVEST_CROPS_REPOSITORY = Symbol('HARVEST_CROPS_REPOSITORY');

export interface HarvestCropsRepositoryPort {
  create(data: Partial<HarvestCrop>): HarvestCrop;
  save(harvestCrop: HarvestCrop): Promise<HarvestCrop>;
  findByHarvestIdAndCropId(harvestId: string, cropId: string): Promise<HarvestCrop | null>;
  remove(harvestCrop: HarvestCrop): Promise<void>;
}
