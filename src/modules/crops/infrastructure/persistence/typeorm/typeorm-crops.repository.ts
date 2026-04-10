import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Crop } from '@/modules/agriculture/entities/crop.entity';
import { CropsRepositoryPort } from '@/modules/crops/application/ports/crops.repository';

@Injectable()
export class TypeOrmCropsRepository implements CropsRepositoryPort {
  constructor(
    @InjectRepository(Crop)
    private readonly repository: Repository<Crop>,
  ) {}

  create(data: Partial<Crop>): Crop {
    return this.repository.create(data);
  }

  save(crop: Crop): Promise<Crop> {
    return this.repository.save(crop);
  }

  findById(id: string): Promise<Crop | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByNameInsensitive(name: string): Promise<Crop | null> {
    return this.repository.findOne({
      where: {
        name: ILike(name),
      },
    });
  }

  findAll(): Promise<Crop[]> {
    return this.repository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
