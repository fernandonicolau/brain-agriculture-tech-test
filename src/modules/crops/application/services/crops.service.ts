import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { Crop } from '@/modules/agriculture/entities/crop.entity';
import {
  CreateCropCommand,
  CropResult,
} from '@/modules/crops/application/contracts/crops.contracts';
import {
  CROPS_REPOSITORY,
  CropsRepositoryPort,
} from '@/modules/crops/application/ports/crops.repository';

@Injectable()
export class CropsService {
  constructor(
    @Inject(CROPS_REPOSITORY)
    private readonly cropsRepository: CropsRepositoryPort,
  ) {}

  async create(command: CreateCropCommand): Promise<CropResult> {
    const normalizedName = command.name.trim();
    const existingCrop = await this.cropsRepository.findByNameInsensitive(normalizedName);

    if (existingCrop) {
      throw new ConflictException('Crop name already exists');
    }

    const crop = this.cropsRepository.create({
      name: normalizedName,
    });

    const savedCrop = await this.cropsRepository.save(crop);

    return this.toResponse(savedCrop);
  }

  async findAll(): Promise<CropResult[]> {
    const crops = await this.cropsRepository.findAll();

    return crops.map((crop) => this.toResponse(crop));
  }

  private toResponse(crop: Crop): CropResult {
    return {
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt.toISOString(),
      updatedAt: crop.updatedAt.toISOString(),
    };
  }
}
