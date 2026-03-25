import { Crop } from '@/modules/agriculture/entities/crop.entity';

export const CROPS_REPOSITORY = Symbol('CROPS_REPOSITORY');

export interface CropsRepositoryPort {
  create(data: Partial<Crop>): Crop;
  save(crop: Crop): Promise<Crop>;
  findById(id: string): Promise<Crop | null>;
  findByNameInsensitive(name: string): Promise<Crop | null>;
  findAll(): Promise<Crop[]>;
}
