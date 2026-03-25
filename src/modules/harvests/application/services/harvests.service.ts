import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Crop } from '@/modules/agriculture/entities/crop.entity';
import { Harvest } from '@/modules/agriculture/entities/harvest.entity';
import {
  AttachCropCommand,
  CreateHarvestCommand,
  HarvestResult,
  ListHarvestsQuery,
  PaginatedHarvestsResult,
  UpdateHarvestCommand,
} from '@/modules/harvests/application/contracts/harvests.contracts';
import {
  CROPS_REPOSITORY,
  CropsRepositoryPort,
} from '@/modules/crops/application/ports/crops.repository';
import {
  FARMS_REPOSITORY,
  FarmsRepositoryPort,
} from '@/modules/farms/application/ports/farms.repository';
import {
  HARVEST_CROPS_REPOSITORY,
  HarvestCropsRepositoryPort,
} from '@/modules/harvests/application/ports/harvest-crops.repository';
import {
  HARVESTS_REPOSITORY,
  HarvestsRepositoryPort,
} from '@/modules/harvests/application/ports/harvests.repository';

@Injectable()
export class HarvestsService {
  constructor(
    @Inject(HARVESTS_REPOSITORY)
    private readonly harvestsRepository: HarvestsRepositoryPort,
    @Inject(HARVEST_CROPS_REPOSITORY)
    private readonly harvestCropsRepository: HarvestCropsRepositoryPort,
    @Inject(FARMS_REPOSITORY)
    private readonly farmsRepository: FarmsRepositoryPort,
    @Inject(CROPS_REPOSITORY)
    private readonly cropsRepository: CropsRepositoryPort,
  ) {}

  async create(command: CreateHarvestCommand): Promise<HarvestResult> {
    await this.ensureFarmExists(command.farmId);

    const harvest = this.harvestsRepository.create(command);
    const savedHarvest = await this.harvestsRepository.save(harvest);

    return this.toResponse(savedHarvest);
  }

  async findAll(query: ListHarvestsQuery): Promise<PaginatedHarvestsResult> {
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

  async findOne(id: string): Promise<HarvestResult> {
    const harvest = await this.harvestsRepository.findByIdWithRelations(id);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    return this.toResponse(harvest, {
      includeFarm: true,
      includeCrops: true,
    });
  }

  async update(id: string, command: UpdateHarvestCommand): Promise<HarvestResult> {
    const harvest = await this.harvestsRepository.findById(id);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    if (command.farmId && command.farmId !== harvest.farmId) {
      await this.ensureFarmExists(command.farmId);
    }

    Object.assign(harvest, command);

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

  async attachCrop(harvestId: string, command: AttachCropCommand): Promise<HarvestResult> {
    const harvest = await this.harvestsRepository.findById(harvestId);

    if (!harvest) {
      throw new NotFoundException('Harvest not found');
    }

    const crop = await this.cropsRepository.findById(command.cropId);

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    const existingAssociation = await this.harvestCropsRepository.findByHarvestIdAndCropId(
      harvestId,
      command.cropId,
    );

    if (existingAssociation) {
      throw new ConflictException('Crop is already associated with this harvest');
    }

    const harvestCrop = this.harvestCropsRepository.create({
      harvestId,
      cropId: command.cropId,
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
  ): HarvestResult {
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
