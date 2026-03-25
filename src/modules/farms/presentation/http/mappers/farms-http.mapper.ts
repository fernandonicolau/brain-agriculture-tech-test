import {
  CreateFarmCommand,
  FarmResult,
  ListFarmsQuery,
  PaginatedFarmsResult,
  UpdateFarmCommand,
} from '@/modules/farms/application/contracts/farms.contracts';
import { CreateFarmDto } from '@/modules/farms/presentation/http/dto/create-farm.dto';
import { FarmResponseDto } from '@/modules/farms/presentation/http/dto/farm-response.dto';
import { ListFarmsQueryDto } from '@/modules/farms/presentation/http/dto/list-farms-query.dto';
import { PaginatedFarmsResponseDto } from '@/modules/farms/presentation/http/dto/paginated-farms-response.dto';
import { UpdateFarmDto } from '@/modules/farms/presentation/http/dto/update-farm.dto';

export class FarmsHttpMapper {
  static toCreateCommand(dto: CreateFarmDto): CreateFarmCommand {
    return { ...dto };
  }

  static toUpdateCommand(dto: UpdateFarmDto): UpdateFarmCommand {
    return { ...dto };
  }

  static toListQuery(dto: ListFarmsQueryDto): ListFarmsQuery {
    return { ...dto };
  }

  static toResponse(result: FarmResult): FarmResponseDto {
    return {
      ...result,
      producer: result.producer ? { ...result.producer } : undefined,
      harvests: result.harvests?.map((harvest) => ({
        ...harvest,
        crops: harvest.crops?.map((crop) => ({ ...crop })),
      })),
    };
  }

  static toPaginatedResponse(result: PaginatedFarmsResult): PaginatedFarmsResponseDto {
    return {
      data: result.data.map((item) => this.toResponse(item)),
      meta: { ...result.meta },
    };
  }
}
