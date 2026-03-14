import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Crop } from '../agriculture/entities/crop.entity';
import { Harvest } from '../agriculture/entities/harvest.entity';
import { CropsRepository } from '../crops/crops.repository';
import { FarmsRepository } from '../farms/farms.repository';
import { AttachCropDto } from './dto/attach-crop.dto';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { HarvestResponseDto } from './dto/harvest-response.dto';
import { ListHarvestsQueryDto } from './dto/list-harvests-query.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestCropsRepository } from './harvest-crops.repository';
import { HarvestsRepository } from './harvests.repository';

type PaginatedHarvests = {
  data: HarvestResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

@Injectable()
export class HarvestsService {
  constructor(
    private readonly harvestsRepository: HarvestsRepository,
    private readonly harvestCropsRepository: HarvestCropsRepository,
    private readonly farmsRepository: FarmsRepository,
    private readonly cropsRepository: CropsRepository,
  ) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<HarvestResponseDto> {
    await this.ensureFarmExists(createHarvestDto.farmId);

    const harvest = this.harvestsRepository.create(createHarvestDto);
    const savedHarvest = await this.harvestsRepository.save(harvest);

    return this.toResponse(savedHarvest);
  }

  async findAll(query: ListHarvestsQueryDto): Promise<PaginatedHarvests> {
    const [harvests, total] = await this.harvestsRepository.findAll(query);

    return {
      data: harvests.map((harvest) => this.toResponse(harvest, { includeCrops: true })),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<HarvestResponseDto> {
    const harvest = await this.harvestsRepository.findByIdWithRelations(id);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    return this.toResponse(harvest, {
      includeFarm: true,
      includeCrops: true,
    });
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto): Promise<HarvestResponseDto> {
    const harvest = await this.harvestsRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    if (updateHarvestDto.farmId && updateHarvestDto.farmId !== harvest.farmId) {
      await this.ensureFarmExists(updateHarvestDto.farmId);
    }

    Object.assign(harvest, updateHarvestDto);

    const updatedHarvest = await this.harvestsRepository.save(harvest);

    return this.toResponse(updatedHarvest);
  }

  async remove(id: string): Promise<void> {
    const harvest = await this.harvestsRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    await this.harvestsRepository.remove(harvest);
  }

  async attachCrop(harvestId: string, attachCropDto: AttachCropDto): Promise<HarvestResponseDto> {
    const harvest = await this.harvestsRepository.findById(harvestId);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    const crop = await this.cropsRepository.findById(attachCropDto.cropId);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    const existingAssociation = await this.harvestCropsRepository.findByHarvestIdAndCropId(
      harvestId,
      attachCropDto.cropId,
    );

    if (existingAssociation) {
      throw new ConflictException('Crop is already associated with this harvest');
    }

    const harvestCrop = this.harvestCropsRepository.create({
      harvestId,
      cropId: attachCropDto.cropId,
    });

    await this.harvestCropsRepository.save(harvestCrop);

    const updatedHarvest = await this.harvestsRepository.findByIdWithRelations(harvestId);

    if (!updatedHarvest) {
      throw new NotFoundException('Harvest not found');
    }

    return this.toResponse(updatedHarvest, {
      includeFarm: true,
      includeCrops: true,
    });
  }

  async detachCrop(harvestId: string, cropId: string): Promise<void> {
    const harvest = await this.harvestsRepository.findById(harvestId);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    const association = await this.harvestCropsRepository.findByHarvestIdAndCropId(
      harvestId,
      cropId,
    );

    if (!association) {
      throw new NotFoundException('Harvest crop association not found');
    }

    await this.harvestCropsRepository.remove(association);
  }

  private async ensureFarmExists(farmId: string): Promise<void> {
    const farm = await this.farmsRepository.findById(farmId);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
  }

  private toCropResponse(crop: Crop) {
    return {
      id: crop.id,
      name: crop.name,
      createdAt: crop.createdAt.toISOString(),
      updatedAt: crop.updatedAt.toISOString(),
    };
  }

  private toResponse(
    harvest: Harvest & {
      farm?: {
        id: string;
        name: string;
        city: string;
        state: string;
      };
      harvestCrops?: Array<{
        crop: Crop;
      }>;
    },
    options?: {
      includeFarm?: boolean;
      includeCrops?: boolean;
    },
  ): HarvestResponseDto {
    return {
      id: harvest.id,
      farmId: harvest.farmId,
      name: harvest.name,
      year: harvest.year,
      createdAt: harvest.createdAt.toISOString(),
      updatedAt: harvest.updatedAt.toISOString(),
      farm:
        options?.includeFarm && harvest.farm
          ? {
              id: harvest.farm.id,
              name: harvest.farm.name,
              city: harvest.farm.city,
              state: harvest.farm.state,
            }
          : undefined,
      crops:
        options?.includeCrops && harvest.harvestCrops
          ? harvest.harvestCrops.map((item) => this.toCropResponse(item.crop))
          : undefined,
    };
  }
}
