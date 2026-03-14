import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Harvest } from '../agriculture/entities/harvest.entity';

type FindAllParams = {
  page: number;
  limit: number;
  farmId?: string;
};

@Injectable()
export class HarvestsRepository {
  constructor(
    @InjectRepository(Harvest)
    private readonly repository: Repository<Harvest>,
  ) {}

  create(data: Partial<Harvest>): Harvest {
    return this.repository.create(data);
  }

  save(harvest: Harvest): Promise<Harvest> {
    return this.repository.save(harvest);
  }

  findById(id: string): Promise<Harvest | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByIdWithRelations(id: string): Promise<Harvest | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        farm: true,
        harvestCrops: {
          crop: true,
        },
      },
    });
  }

  async findAll({ page, limit, farmId }: FindAllParams): Promise<[Harvest[], number]> {
    return this.repository.findAndCount({
      where: farmId ? { farmId } : {},
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        harvestCrops: {
          crop: true,
        },
      },
    });
  }

  async remove(harvest: Harvest): Promise<void> {
    await this.repository.remove(harvest);
  }
}
