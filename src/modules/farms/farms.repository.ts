import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Farm } from '../agriculture/entities/farm.entity';

type FindAllParams = {
  page: number;
  limit: number;
  producerId?: string;
  state?: string;
  city?: string;
};

@Injectable()
export class FarmsRepository {
  constructor(
    @InjectRepository(Farm)
    private readonly repository: Repository<Farm>,
  ) {}

  create(data: Partial<Farm>): Farm {
    return this.repository.create(data);
  }

  save(farm: Farm): Promise<Farm> {
    return this.repository.save(farm);
  }

  findById(id: string): Promise<Farm | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByIdWithProducer(id: string): Promise<Farm | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        producer: true,
        harvests: {
          harvestCrops: {
            crop: true,
          },
        },
      },
    });
  }

  async findAll({
    page,
    limit,
    producerId,
    state,
    city,
  }: FindAllParams): Promise<[Farm[], number]> {
    const where: FindOptionsWhere<Farm> = {};

    if (producerId) {
      where.producerId = producerId;
    }

    if (state) {
      where.state = state;
    }

    if (city) {
      where.city = ILike(`%${city}%`);
    }

    return this.repository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async remove(farm: Farm): Promise<void> {
    await this.repository.remove(farm);
  }
}
