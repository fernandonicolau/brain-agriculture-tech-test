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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { HarvestsService } from '@/modules/harvests/application/services/harvests.service';
import { AttachCropDto } from '@/modules/harvests/presentation/http/dto/attach-crop.dto';
import { CreateHarvestDto } from '@/modules/harvests/presentation/http/dto/create-harvest.dto';
import { HarvestResponseDto } from '@/modules/harvests/presentation/http/dto/harvest-response.dto';
import { ListHarvestsQueryDto } from '@/modules/harvests/presentation/http/dto/list-harvests-query.dto';
import { PaginatedHarvestsResponseDto } from '@/modules/harvests/presentation/http/dto/paginated-harvests-response.dto';
import { UpdateHarvestDto } from '@/modules/harvests/presentation/http/dto/update-harvest.dto';
import { HarvestsHttpMapper } from '@/modules/harvests/presentation/http/mappers/harvests-http.mapper';

@ApiTags('Harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Cria uma safra',
  })
  @ApiCreatedResponse({
    type: HarvestResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Fazenda nao encontrada.',
  })
  create(@Body() createHarvestDto: CreateHarvestDto): Promise<HarvestResponseDto> {
    return this.harvestsService
      .create(HarvestsHttpMapper.toCreateCommand(createHarvestDto))
      .then((result) => HarvestsHttpMapper.toResponse(result));
  }

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Lista safras com paginacao',
  })
  @ApiOkResponse({
    type: PaginatedHarvestsResponseDto,
  })
  findAll(@Query() query: ListHarvestsQueryDto): Promise<PaginatedHarvestsResponseDto> {
    return this.harvestsService
      .findAll(HarvestsHttpMapper.toListQuery(query))
      .then((result) => HarvestsHttpMapper.toPaginatedResponse(result));
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Busca uma safra com suas culturas',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da safra',
  })
  @ApiOkResponse({
    type: HarvestResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Safra nao encontrada.',
  })
  findOne(@Param('id') id: string): Promise<HarvestResponseDto> {
    return this.harvestsService.findOne(id).then((result) => HarvestsHttpMapper.toResponse(result));
  }

  @Patch(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Atualiza uma safra',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da safra',
  })
  @ApiOkResponse({
    type: HarvestResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Safra ou fazenda nao encontrada.',
  })
  update(
    @Param('id') id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ): Promise<HarvestResponseDto> {
    return this.harvestsService
      .update(id, HarvestsHttpMapper.toUpdateCommand(updateHarvestDto))
      .then((result) => HarvestsHttpMapper.toResponse(result));
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove uma safra',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da safra',
  })
  @ApiNoContentResponse({
    description: 'Safra removida com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Safra nao encontrada.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.harvestsService.remove(id);
  }

  @Post(':id/crops')
  @Version('1')
  @ApiOperation({
    summary: 'Associa uma cultura a uma safra',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da safra',
  })
  @ApiCreatedResponse({
    type: HarvestResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Safra ou cultura nao encontrada.',
  })
  @ApiConflictResponse({
    description: 'Cultura ja associada a safra.',
  })
  attachCrop(
    @Param('id') id: string,
    @Body() attachCropDto: AttachCropDto,
  ): Promise<HarvestResponseDto> {
    return this.harvestsService
      .attachCrop(id, HarvestsHttpMapper.toAttachCropCommand(attachCropDto))
      .then((result) => HarvestsHttpMapper.toResponse(result));
  }

  @Delete(':id/crops/:cropId')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a associacao entre safra e cultura',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da safra',
  })
  @ApiParam({
    name: 'cropId',
    description: 'UUID da cultura',
  })
  @ApiNoContentResponse({
    description: 'Associacao removida com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Safra ou associacao nao encontrada.',
  })
  detachCrop(@Param('id') id: string, @Param('cropId') cropId: string): Promise<void> {
    return this.harvestsService.detachCrop(id, cropId);
  }
}
