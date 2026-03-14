import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { CropResponseDto } from './dto/crop-response.dto';

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
    return this.cropsService.create(createCropDto);
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
    return this.cropsService.findAll();
  }
}
