import {
  CreateProducerCommand,
  ListProducersQuery,
  PaginatedProducersResult,
  ProducerResult,
  UpdateProducerCommand,
} from '@/modules/producers/application/contracts/producers.contracts';
import { CreateProducerDto } from '@/modules/producers/presentation/http/dto/create-producer.dto';
import { ListProducersQueryDto } from '@/modules/producers/presentation/http/dto/list-producers-query.dto';
import { PaginatedProducersResponseDto } from '@/modules/producers/presentation/http/dto/paginated-producers-response.dto';
import { ProducerResponseDto } from '@/modules/producers/presentation/http/dto/producer-response.dto';
import { UpdateProducerDto } from '@/modules/producers/presentation/http/dto/update-producer.dto';

export class ProducersHttpMapper {
  static toCreateCommand(dto: CreateProducerDto): CreateProducerCommand {
    return { ...dto };
  }

  static toUpdateCommand(dto: UpdateProducerDto): UpdateProducerCommand {
    return { ...dto };
  }

  static toListQuery(dto: ListProducersQueryDto): ListProducersQuery {
    return { ...dto };
  }

  static toResponse(result: ProducerResult): ProducerResponseDto {
    return { ...result };
  }

  static toPaginatedResponse(result: PaginatedProducersResult): PaginatedProducersResponseDto {
    return {
      data: result.data.map((item) => this.toResponse(item)),
      meta: { ...result.meta },
    };
  }
}
