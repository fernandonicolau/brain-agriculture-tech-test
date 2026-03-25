import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { validateBrazilianDocument } from '@/common/validators/document.validator';
import { Producer } from '@/modules/agriculture/entities/producer.entity';
import {
  CreateProducerCommand,
  ListProducersQuery,
  PaginatedProducersResult,
  ProducerResult,
  UpdateProducerCommand,
} from '@/modules/producers/application/contracts/producers.contracts';
import {
  PRODUCERS_REPOSITORY,
  ProducersRepositoryPort,
} from '@/modules/producers/application/ports/producers.repository';

@Injectable()
export class ProducersService {
  constructor(
    @Inject(PRODUCERS_REPOSITORY)
    private readonly producersRepository: ProducersRepositoryPort,
  ) {}

  async create(command: CreateProducerCommand): Promise<ProducerResult> {
    const normalizedDocument = this.validateProducerDocument(command.document);
    const existingProducer = await this.producersRepository.findByDocument(normalizedDocument);

    if (existingProducer) {
      throw new ConflictException('Producer document already exists');
    }

    const producer = this.producersRepository.create({
      ...command,
      document: normalizedDocument,
    });

    try {
      const savedProducer = await this.producersRepository.save(producer);
      return this.toResponse(savedProducer);
    } catch (error) {
      this.handleDuplicateDocumentError(error);
      throw error;
    }
  }

  async findAll(query: ListProducersQuery): Promise<PaginatedProducersResult> {
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

  async findOne(id: string): Promise<ProducerResult> {
    const producer = await this.producersRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return this.toResponse(producer);
  }

  async update(id: string, command: UpdateProducerCommand): Promise<ProducerResult> {
    const producer = await this.producersRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    if (command.document && command.document !== producer.document) {
      const normalizedDocument = this.validateProducerDocument(command.document);
      const producerWithSameDocument =
        await this.producersRepository.findByDocument(normalizedDocument);

      if (producerWithSameDocument && producerWithSameDocument.id !== producer.id) {
        throw new ConflictException('Producer document already exists');
      }

      command.document = normalizedDocument;
    }

    Object.assign(producer, command);

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

  private validateProducerDocument(document: string): string {
    const validationResult = validateBrazilianDocument(document);

    if (!validationResult) {
      throw new BadRequestException('Producer document must be a valid CPF or CNPJ');
    }

    return validationResult.normalizedDocument;
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

  private toResponse(producer: Producer): ProducerResult {
    return {
      id: producer.id,
      document: producer.document,
      name: producer.name,
      createdAt: producer.createdAt.toISOString(),
      updatedAt: producer.updatedAt.toISOString(),
    };
  }
}
