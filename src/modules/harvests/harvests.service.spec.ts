import { ConflictException, NotFoundException } from '@nestjs/common';

import { Crop } from '../agriculture/entities/crop.entity';
import { HarvestCrop } from '../agriculture/entities/harvest-crop.entity';
import { Harvest } from '../agriculture/entities/harvest.entity';
import { CropsRepository } from '../crops/crops.repository';
import { FarmsRepository } from '../farms/farms.repository';
import { HarvestCropsRepository } from './harvest-crops.repository';
import { HarvestsRepository } from './harvests.repository';
import { HarvestsService } from './harvests.service';

describe('HarvestsService', () => {
  let service: HarvestsService;
  let harvestsRepository: jest.Mocked<HarvestsRepository>;
  let harvestCropsRepository: jest.Mocked<HarvestCropsRepository>;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let cropsRepository: jest.Mocked<CropsRepository>;

  const crop: Crop = {
    id: 'd93720cc-2802-4105-a55e-f56c9e2cfc43',
    name: 'Soja',
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    harvestCrops: [],
  };

  const harvest = {
    id: '7a8d4af5-f9b8-4d6a-b334-4493accc5101',
    farmId: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
    name: 'Safra 2024/2025',
    year: 2024,
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    farm: {
      id: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
      name: 'Fazenda Primavera',
      city: 'Sorriso',
      state: 'MT',
    },
    harvestCrops: [{ crop }],
  } as unknown as Harvest & {
    farm?: {
      id: string;
      name: string;
      city: string;
      state: string;
    };
    harvestCrops?: Array<{
      crop: Crop;
    }>;
  };

  beforeEach(() => {
    harvestsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByIdWithRelations: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<HarvestsRepository>;

    harvestCropsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByHarvestIdAndCropId: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<HarvestCropsRepository>;

    farmsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByIdWithProducer: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<FarmsRepository>;

    cropsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByNameInsensitive: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<CropsRepository>;

    service = new HarvestsService(
      harvestsRepository,
      harvestCropsRepository,
      farmsRepository,
      cropsRepository,
    );
  });

  it('returns a harvest with crops', async () => {
    harvestsRepository.findByIdWithRelations.mockResolvedValue(harvest);

    const result = await service.findOne(harvest.id);

    expect(result.crops).toHaveLength(1);
    expect(result.crops?.[0]?.name).toBe('Soja');
  });

  it('throws conflict when crop is already associated', async () => {
    const association = {
      id: 'association-id',
      harvestId: harvest.id,
      cropId: crop.id,
      createdAt: new Date('2026-03-14T18:45:00.000Z'),
      updatedAt: new Date('2026-03-14T18:45:00.000Z'),
      harvest,
      crop,
    } as HarvestCrop;

    harvestsRepository.findById.mockResolvedValue(harvest);
    cropsRepository.findById.mockResolvedValue(crop);
    harvestCropsRepository.findByHarvestIdAndCropId.mockResolvedValue(association);

    await expect(service.attachCrop(harvest.id, { cropId: crop.id })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('throws not found when harvest does not exist', async () => {
    harvestsRepository.findByIdWithRelations.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
