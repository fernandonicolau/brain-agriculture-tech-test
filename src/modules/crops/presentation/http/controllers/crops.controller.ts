import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CropsService } from '@/modules/crops/application/services/crops.service';
import { CreateCropDto } from '@/modules/crops/presentation/http/dto/create-crop.dto';
import { CropResponseDto } from '@/modules/crops/presentation/http/dto/crop-response.dto';
import { CropsHttpMapper } from '@/modules/crops/presentation/http/mappers/crops-http.mapper';

@ApiTags('Crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Cria uma cultura',
  })
  @ApiCreatedResponse({
    type: CropResponseDto,
  })
  @ApiConflictResponse({
    description: 'Nome da cultura ja cadastrado.',
  })
  create(@Body() createCropDto: CreateCropDto): Promise<CropResponseDto> {
    return this.cropsService
      .create(CropsHttpMapper.toCreateCommand(createCropDto))
      .then((result) => CropsHttpMapper.toResponse(result));
  }

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Lista culturas',
  })
  @ApiOkResponse({
    type: [CropResponseDto],
  })
  findAll(): Promise<CropResponseDto[]> {
    return this.cropsService
      .findAll()
      .then((result) => result.map((item) => CropsHttpMapper.toResponse(item)));
  }
}
