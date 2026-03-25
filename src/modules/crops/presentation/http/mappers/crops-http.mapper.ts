import {
  CreateCropCommand,
  CropResult,
} from '@/modules/crops/application/contracts/crops.contracts';
import { CreateCropDto } from '@/modules/crops/presentation/http/dto/create-crop.dto';
import { CropResponseDto } from '@/modules/crops/presentation/http/dto/crop-response.dto';

export class CropsHttpMapper {
  static toCreateCommand(dto: CreateCropDto): CreateCropCommand {
    return { ...dto };
  }

  static toResponse(result: CropResult): CropResponseDto {
    return { ...result };
  }
}
