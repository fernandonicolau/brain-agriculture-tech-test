import {
  AttachCropCommand,
  CreateHarvestCommand,
  HarvestResult,
  ListHarvestsQuery,
  PaginatedHarvestsResult,
  UpdateHarvestCommand,
} from '@/modules/harvests/application/contracts/harvests.contracts';
import { AttachCropDto } from '@/modules/harvests/presentation/http/dto/attach-crop.dto';
import { CreateHarvestDto } from '@/modules/harvests/presentation/http/dto/create-harvest.dto';
import { HarvestResponseDto } from '@/modules/harvests/presentation/http/dto/harvest-response.dto';
import { ListHarvestsQueryDto } from '@/modules/harvests/presentation/http/dto/list-harvests-query.dto';
import { PaginatedHarvestsResponseDto } from '@/modules/harvests/presentation/http/dto/paginated-harvests-response.dto';
import { UpdateHarvestDto } from '@/modules/harvests/presentation/http/dto/update-harvest.dto';

export class HarvestsHttpMapper {
  static toCreateCommand(dto: CreateHarvestDto): CreateHarvestCommand {
    return { ...dto };
  }

  static toUpdateCommand(dto: UpdateHarvestDto): UpdateHarvestCommand {
    return { ...dto };
  }

  static toAttachCropCommand(dto: AttachCropDto): AttachCropCommand {
    return { ...dto };
  }

  static toListQuery(dto: ListHarvestsQueryDto): ListHarvestsQuery {
    return { ...dto };
  }

  static toResponse(result: HarvestResult): HarvestResponseDto {
    return {
      ...result,
      farm: result.farm ? { ...result.farm } : undefined,
      crops: result.crops?.map((crop) => ({ ...crop })),
    };
  }

  static toPaginatedResponse(result: PaginatedHarvestsResult): PaginatedHarvestsResponseDto {
    return {
      data: result.data.map((item) => this.toResponse(item)),
      meta: { ...result.meta },
    };
  }
}
