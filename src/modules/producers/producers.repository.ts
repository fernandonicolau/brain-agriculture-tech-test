import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Producer } from '../agriculture/entities/producer.entity';

type PaginationParams = {
  page: number;
  limit: number;
};

@Injectable()
export class ProducersRepository {
  constructor(
    @InjectRepository(Producer)
    private readonly repository: Repository<Producer>,
  ) {}

  create(data: Partial<Producer>): Producer {
    return this.repository.create(data);
  }

  save(producer: Producer): Promise<Producer> {
    return this.repository.save(producer);
  }

  findById(id: string): Promise<Producer | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByDocument(document: string): Promise<Producer | null> {
    return this.repository.findOne({
      where: { document },
    });
  }

  async findAll({ page, limit }: PaginationParams): Promise<[Producer[], number]> {
    return this.repository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async remove(producer: Producer): Promise<void> {
    await this.repository.remove(producer);
  }
}
