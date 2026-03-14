import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmResponseDto } from './dto/farm-response.dto';
import { ListFarmsQueryDto } from './dto/list-farms-query.dto';
import { PaginatedFarmsResponseDto } from './dto/paginated-farms-response.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsService } from './farms.service';

@ApiTags('Farms')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Cria uma propriedade rural',
  })
  @ApiCreatedResponse({
    type: FarmResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produtor nao encontrado.',
  })
  create(@Body() createFarmDto: CreateFarmDto): Promise<FarmResponseDto> {
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Lista propriedades rurais com paginacao e filtros',
  })
  @ApiOkResponse({
    type: PaginatedFarmsResponseDto,
  })
  findAll(@Query() query: ListFarmsQueryDto): Promise<PaginatedFarmsResponseDto> {
    return this.farmsService.findAll(query);
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Busca uma propriedade rural por id',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da propriedade rural',
  })
  @ApiOkResponse({
    type: FarmResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Propriedade rural nao encontrada.',
  })
  findOne(@Param('id') id: string): Promise<FarmResponseDto> {
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Atualiza uma propriedade rural',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da propriedade rural',
  })
  @ApiOkResponse({
    type: FarmResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Propriedade rural ou produtor nao encontrado.',
  })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto): Promise<FarmResponseDto> {
    return this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove uma propriedade rural',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da propriedade rural',
  })
  @ApiNoContentResponse({
    description: 'Propriedade rural removida com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Propriedade rural nao encontrada.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.farmsService.remove(id);
  }
}
