import { ConflictException } from '@nestjs/common';

import { Crop } from '../agriculture/entities/crop.entity';
import { CropsRepository } from './crops.repository';
import { CropsService } from './crops.service';

describe('CropsService', () => {
  let service: CropsService;
  let repository: jest.Mocked<CropsRepository>;

  const crop: Crop = {
    id: 'd93720cc-2802-4105-a55e-f56c9e2cfc43',
    name: 'Soja',
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    harvestCrops: [],
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByNameInsensitive: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<CropsRepository>;

    service = new CropsService(repository);
  });

  it('creates a crop', async () => {
    repository.findByNameInsensitive.mockResolvedValue(null);
    repository.create.mockReturnValue(crop);
    repository.save.mockResolvedValue(crop);

    const result = await service.create({ name: 'Soja' });

    expect(result.name).toBe('Soja');
  });

  it('throws conflict for duplicate crop name', async () => {
    repository.findByNameInsensitive.mockResolvedValue(crop);

    await expect(service.create({ name: 'soja' })).rejects.toBeInstanceOf(ConflictException);
  });
});
