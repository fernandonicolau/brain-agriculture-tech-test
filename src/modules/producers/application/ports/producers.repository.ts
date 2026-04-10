import { Producer } from '@/modules/agriculture/entities/producer.entity';

export const PRODUCERS_REPOSITORY = Symbol('PRODUCERS_REPOSITORY');

export type ProducerPaginationParams = {
  page: number;
  limit: number;
};

export interface ProducersRepositoryPort {
  create(data: Partial<Producer>): Producer;
  save(producer: Producer): Promise<Producer>;
  findById(id: string): Promise<Producer | null>;
  findByDocument(document: string): Promise<Producer | null>;
  findAll(params: ProducerPaginationParams): Promise<[Producer[], number]>;
  remove(producer: Producer): Promise<void>;
}
