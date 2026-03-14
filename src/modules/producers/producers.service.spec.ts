import { ConflictException, NotFoundException } from '@nestjs/common';

import { Producer } from '../agriculture/entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ProducersRepository } from './producers.repository';
import { ProducersService } from './producers.service';

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: jest.Mocked<ProducersRepository>;

  const baseProducer: Producer = {
    id: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
    document: '12345678901',
    name: 'Maria da Silva',
    createdAt: new Date('2026-03-14T18:45:00.000Z'),
    updatedAt: new Date('2026-03-14T18:45:00.000Z'),
    farms: [],
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ProducersRepository>;

    service = new ProducersService(repository);
  });

  it('creates a producer', async () => {
    const dto: CreateProducerDto = {
      document: '12345678901',
      name: 'Maria da Silva',
    };

    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockReturnValue(baseProducer);
    repository.save.mockResolvedValue(baseProducer);

    const result = await service.create(dto);

    expect(result.document).toBe(dto.document);
    expect(repository.findByDocument).toHaveBeenCalledWith(dto.document);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('throws conflict when document already exists', async () => {
    repository.findByDocument.mockResolvedValue(baseProducer);

    await expect(
      service.create({
        document: '12345678901',
        name: 'Maria da Silva',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws not found when producer does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
