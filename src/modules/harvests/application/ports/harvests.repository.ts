import { Harvest } from '@/modules/agriculture/entities/harvest.entity';

export const HARVESTS_REPOSITORY = Symbol('HARVESTS_REPOSITORY');

export type FindAllHarvestsParams = {
  page: number;
  limit: number;
  farmId?: string;
};

export interface HarvestsRepositoryPort {
  create(data: Partial<Harvest>): Harvest;
  save(harvest: Harvest): Promise<Harvest>;
  findById(id: string): Promise<Harvest | null>;
  findByIdWithRelations(id: string): Promise<Harvest | null>;
  findAll(params: FindAllHarvestsParams): Promise<[Harvest[], number]>;
  remove(harvest: Harvest): Promise<void>;
}
