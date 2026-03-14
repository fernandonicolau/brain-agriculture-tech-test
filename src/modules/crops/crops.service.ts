import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Crop } from '../agriculture/entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { CropResponseDto } from './dto/crop-response.dto';
import { CropsRepository } from './crops.repository';

@Injectable()
export class CropsService {
  constructor(private readonly cropsRepository: CropsRepository) {}

  async create(createCropDto: CreateCropDto): Promise<CropResponseDto> {
    const normalizedName = createCropDto.name.trim();
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

  async findAll(): Promise<CropResponseDto[]> {
    const crops = await this.cropsRepository.findAll();

    return crops.map((crop) => this.toResponse(crop));
  }

  async findOneOrFail(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findById(id);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return crop;
  }

  private toResponse(crop: Crop): CropResponseDto {
    return {
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt.toISOString(),
      updatedAt: crop.updatedAt.toISOString(),
    };
  }
}
