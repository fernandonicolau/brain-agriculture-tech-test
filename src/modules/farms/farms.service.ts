import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { isFarmAreaUsageValid } from '../../common/validators/farm-area.validator';
import { Producer } from '../agriculture/entities/producer.entity';
import { ProducersRepository } from '../producers/producers.repository';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmResponseDto } from './dto/farm-response.dto';
import { ListFarmsQueryDto } from './dto/list-farms-query.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsRepository } from './farms.repository';

type PaginatedFarms = {
  data: FarmResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

@Injectable()
export class FarmsService {
  constructor(
    private readonly farmsRepository: FarmsRepository,
    private readonly producersRepository: ProducersRepository,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<FarmResponseDto> {
    await this.ensureProducerExists(createFarmDto.producerId);
    this.validateAreaRules(createFarmDto);

    const farm = this.farmsRepository.create({
      ...this.normalizeFarmPayload(createFarmDto),
    });

    const savedFarm = await this.farmsRepository.save(farm);

    return this.toResponse(savedFarm);
  }

  async findAll(query: ListFarmsQueryDto): Promise<PaginatedFarms> {
    const [farms, total] = await this.farmsRepository.findAll(query);

    return {
      data: farms.map((farm) => this.toResponse(farm)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<FarmResponseDto> {
    const farm = await this.farmsRepository.findByIdWithProducer(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return this.toResponse(farm, true);
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<FarmResponseDto> {
    const farm = await this.farmsRepository.findById(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    if (updateFarmDto.producerId && updateFarmDto.producerId !== farm.producerId) {
      await this.ensureProducerExists(updateFarmDto.producerId);
    }

    this.validateAreaRules({
      totalArea: updateFarmDto.totalArea ?? Number(farm.totalArea),
      arableArea: updateFarmDto.arableArea ?? Number(farm.arableArea),
      vegetationArea: updateFarmDto.vegetationArea ?? Number(farm.vegetationArea),
    });

    Object.assign(farm, this.normalizeFarmPayload(updateFarmDto));

    const updatedFarm = await this.farmsRepository.save(farm);

    return this.toResponse(updatedFarm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.farmsRepository.findById(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    await this.farmsRepository.remove(farm);
  }

  private async ensureProducerExists(producerId: string): Promise<void> {
    const producer = await this.producersRepository.findById(producerId);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }
  }

  private validateAreaRules(payload: {
    totalArea: number;
    arableArea: number;
    vegetationArea: number;
  }): void {
    if (!isFarmAreaUsageValid(payload)) {
      throw new BadRequestException(
        'The sum of arableArea and vegetationArea cannot exceed totalArea',
      );
    }
  }

  private normalizeFarmPayload(payload: Partial<CreateFarmDto | UpdateFarmDto>) {
    return {
      ...payload,
      state: payload.state?.toUpperCase(),
      totalArea: payload.totalArea?.toFixed(2),
      arableArea: payload.arableArea?.toFixed(2),
      vegetationArea: payload.vegetationArea?.toFixed(2),
    };
  }

  private toResponse(
    farm: {
      id: string;
      producerId: string;
      name: string;
      city: string;
      state: string;
      totalArea: string;
      arableArea: string;
      vegetationArea: string;
      createdAt: Date;
      updatedAt: Date;
      producer?: Producer;
      harvests?: Array<{
        id: string;
        name: string;
        year: number;
        harvestCrops?: Array<{
          crop: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
          };
        }>;
      }>;
    },
    includeProducer = false,
  ): FarmResponseDto {
    return {
      id: farm.id,
      producerId: farm.producerId,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      totalArea: Number(farm.totalArea),
      arableArea: Number(farm.arableArea),
      vegetationArea: Number(farm.vegetationArea),
      createdAt: farm.createdAt.toISOString(),
      updatedAt: farm.updatedAt.toISOString(),
      producer:
        includeProducer && farm.producer
          ? {
              id: farm.producer.id,
              document: farm.producer.document,
              name: farm.producer.name,
            }
          : undefined,
      harvests:
        includeProducer && farm.harvests
          ? farm.harvests.map((harvest) => ({
              id: harvest.id,
              name: harvest.name,
              year: harvest.year,
              crops:
                harvest.harvestCrops?.map((item) => ({
                  id: item.crop.id,
                  name: item.crop.name,
                  createdAt: item.crop.createdAt.toISOString(),
                  updatedAt: item.crop.updatedAt.toISOString(),
                })) ?? [],
            }))
          : undefined,
    };
  }
}
