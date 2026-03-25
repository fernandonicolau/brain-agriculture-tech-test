import { Farm } from '@/modules/agriculture/entities/farm.entity';

export const FARMS_REPOSITORY = Symbol('FARMS_REPOSITORY');

export type FindAllFarmsParams = {
  page: number;
  limit: number;
  producerId?: string;
  state?: string;
  city?: string;
};

export interface FarmsRepositoryPort {
  create(data: Partial<Farm>): Farm;
  save(farm: Farm): Promise<Farm>;
  findById(id: string): Promise<Farm | null>;
  findByIdWithProducer(id: string): Promise<Farm | null>;
  findAll(params: FindAllFarmsParams): Promise<[Farm[], number]>;
  remove(farm: Farm): Promise<void>;
}
