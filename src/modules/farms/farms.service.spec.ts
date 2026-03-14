import { NotFoundException } from '@nestjs/common';

import { Producer } from '../agriculture/entities/producer.entity';
import { ProducersRepository } from '../producers/producers.repository';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmsRepository } from './farms.repository';
import { FarmsService } from './farms.service';

describe('FarmsService', () => {
  let service: FarmsService;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let producersRepository: jest.Mocked<ProducersRepository>;

  const producer: Producer = {
    id: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
    document: '12345678901',
    name: 'Maria da Silva',
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    farms: [],
  };

  const farmEntity = {
    id: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
    producerId: producer.id,
    name: 'Fazenda Primavera',
    city: 'Sorriso',
    state: 'MT',
    totalArea: '1000.50',
    arableArea: '700.25',
    vegetationArea: '300.25',
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    producer,
  };

  beforeEach(() => {
    farmsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByIdWithProducer: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<FarmsRepository>;

    producersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ProducersRepository>;

    service = new FarmsService(farmsRepository, producersRepository);
  });

  it('creates a farm linked to an existing producer', async () => {
    const dto: CreateFarmDto = {
      producerId: producer.id,
      name: 'Fazenda Primavera',
      city: 'Sorriso',
      state: 'mt',
      totalArea: 1000.5,
      arableArea: 700.25,
      vegetationArea: 300.25,
    };

    producersRepository.findById.mockResolvedValue(producer);
    farmsRepository.create.mockReturnValue(farmEntity as never);
    farmsRepository.save.mockResolvedValue(farmEntity as never);

    const result = await service.create(dto);

    expect(producersRepository.findById).toHaveBeenCalledWith(producer.id);
    expect(farmsRepository.create).toHaveBeenCalledWith({
      ...dto,
      state: 'MT',
      totalArea: '1000.50',
      arableArea: '700.25',
      vegetationArea: '300.25',
    });
    expect(result.state).toBe('MT');
  });

  it('throws not found when producer does not exist', async () => {
    producersRepository.findById.mockResolvedValue(null);

    await expect(
      service.create({
        producerId: 'missing-producer',
        name: 'Fazenda Primavera',
        city: 'Sorriso',
        state: 'MT',
        totalArea: 1000,
        arableArea: 700,
        vegetationArea: 300,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns producer summary on findOne', async () => {
    farmsRepository.findByIdWithProducer.mockResolvedValue(farmEntity as never);

    const result = await service.findOne(farmEntity.id);

    expect(result.producer?.id).toBe(producer.id);
    expect(result.producer?.name).toBe(producer.name);
  });
});
