import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { Producer } from '../agriculture/entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ListProducersQueryDto } from './dto/list-producers-query.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducersRepository } from './producers.repository';

type PaginatedProducers = {
  data: ProducerResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

@Injectable()
export class ProducersService {
  constructor(private readonly producersRepository: ProducersRepository) {}

  async create(createProducerDto: CreateProducerDto): Promise<ProducerResponseDto> {
    this.validateProducerDocument(createProducerDto.document);

    const existingProducer = await this.producersRepository.findByDocument(
      createProducerDto.document,
    );

    if (existingProducer) {
      throw new ConflictException('Producer document already exists');
    }

    const producer = this.producersRepository.create(createProducerDto);

    try {
      const savedProducer = await this.producersRepository.save(producer);

      return this.toResponse(savedProducer);
    } catch (error) {
      this.handleDuplicateDocumentError(error);
      throw error;
    }
  }

  async findAll(query: ListProducersQueryDto): Promise<PaginatedProducers> {
    const [producers, total] = await this.producersRepository.findAll(query);

    return {
      data: producers.map((producer) => this.toResponse(producer)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<ProducerResponseDto> {
    const producer = await this.producersRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return this.toResponse(producer);
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<ProducerResponseDto> {
    const producer = await this.producersRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    if (updateProducerDto.document && updateProducerDto.document !== producer.document) {
      this.validateProducerDocument(updateProducerDto.document);

      const producerWithSameDocument = await this.producersRepository.findByDocument(
        updateProducerDto.document,
      );

      if (producerWithSameDocument && producerWithSameDocument.id !== producer.id) {
        throw new ConflictException('Producer document already exists');
      }
    }

    Object.assign(producer, updateProducerDto);

    try {
      const updatedProducer = await this.producersRepository.save(producer);

      return this.toResponse(updatedProducer);
    } catch (error) {
      this.handleDuplicateDocumentError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const producer = await this.producersRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    await this.producersRepository.remove(producer);
  }

  private validateProducerDocument(document: string): void {
    void document;
  }

  private handleDuplicateDocumentError(error: unknown): void {
    if (
      error instanceof QueryFailedError &&
      typeof error.driverError === 'object' &&
      error.driverError !== null &&
      'code' in error.driverError &&
      error.driverError.code === '23505'
    ) {
      throw new ConflictException('Producer document already exists');
    }
  }

  private toResponse(producer: Producer): ProducerResponseDto {
    return {
      id: producer.id,
      document: producer.document,
      name: producer.name,
      createdAt: producer.createdAt.toISOString(),
      updatedAt: producer.updatedAt.toISOString(),
    };
  }
}
