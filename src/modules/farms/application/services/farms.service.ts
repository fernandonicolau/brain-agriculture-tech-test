import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Producer } from '@/modules/agriculture/entities/producer.entity';
import {
  CreateFarmCommand,
  FarmResult,
  ListFarmsQuery,
  PaginatedFarmsResult,
  UpdateFarmCommand,
} from '@/modules/farms/application/contracts/farms.contracts';
import {
  FARMS_REPOSITORY,
  FarmsRepositoryPort,
} from '@/modules/farms/application/ports/farms.repository';
import { FarmAreaPolicyService } from '@/modules/farms/domain/services/farm-area-policy.service';
import {
  PRODUCERS_REPOSITORY,
  ProducersRepositoryPort,
} from '@/modules/producers/application/ports/producers.repository';

@Injectable()
export class FarmsService {
  constructor(
    @Inject(FARMS_REPOSITORY)
    private readonly farmsRepository: FarmsRepositoryPort,
    @Inject(PRODUCERS_REPOSITORY)
    private readonly producersRepository: ProducersRepositoryPort,
  ) {}

  async create(command: CreateFarmCommand): Promise<FarmResult> {
    await this.ensureProducerExists(command.producerId);
    this.validateAreaRules(command);

    const farm = this.farmsRepository.create({
      ...this.normalizeFarmPayload(command),
    });

    const savedFarm = await this.farmsRepository.save(farm);

    return this.toResponse(savedFarm);
  }

  async findAll(query: ListFarmsQuery): Promise<PaginatedFarmsResult> {
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

  async findOne(id: string): Promise<FarmResult> {
    const farm = await this.farmsRepository.findByIdWithProducer(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return this.toResponse(farm, true);
  }

  async update(id: string, command: UpdateFarmCommand): Promise<FarmResult> {
    const farm = await this.farmsRepository.findById(id);

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    if (command.producerId && command.producerId !== farm.producerId) {
      await this.ensureProducerExists(command.producerId);
    }

    this.validateAreaRules({
      totalArea: command.totalArea ?? Number(farm.totalArea),
      arableArea: command.arableArea ?? Number(farm.arableArea),
      vegetationArea: command.vegetationArea ?? Number(farm.vegetationArea),
    });

    Object.assign(farm, this.normalizeFarmPayload(command));

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
    if (!FarmAreaPolicyService.isValid(payload)) {
      throw new BadRequestException(
        'The sum of arableArea and vegetationArea cannot exceed totalArea',
      );
    }
  }

  private normalizeFarmPayload(payload: Partial<CreateFarmCommand | UpdateFarmCommand>) {
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
  ): FarmResult {
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
