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

import { ProducersService } from '@/modules/producers/application/services/producers.service';
import { CreateProducerDto } from '@/modules/producers/presentation/http/dto/create-producer.dto';
import { ListProducersQueryDto } from '@/modules/producers/presentation/http/dto/list-producers-query.dto';
import { PaginatedProducersResponseDto } from '@/modules/producers/presentation/http/dto/paginated-producers-response.dto';
import { ProducerResponseDto } from '@/modules/producers/presentation/http/dto/producer-response.dto';
import { UpdateProducerDto } from '@/modules/producers/presentation/http/dto/update-producer.dto';
import { ProducersHttpMapper } from '@/modules/producers/presentation/http/mappers/producers-http.mapper';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Cria um produtor rural',
  })
  @ApiCreatedResponse({
    type: ProducerResponseDto,
  })
  @ApiConflictResponse({
    description: 'Documento ja cadastrado.',
  })
  create(@Body() createProducerDto: CreateProducerDto): Promise<ProducerResponseDto> {
    return this.producersService
      .create(ProducersHttpMapper.toCreateCommand(createProducerDto))
      .then((result) => ProducersHttpMapper.toResponse(result));
  }

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Lista produtores rurais com paginacao simples',
  })
  @ApiOkResponse({
    type: PaginatedProducersResponseDto,
  })
  findAll(@Query() query: ListProducersQueryDto): Promise<PaginatedProducersResponseDto> {
    return this.producersService
      .findAll(ProducersHttpMapper.toListQuery(query))
      .then((result) => ProducersHttpMapper.toPaginatedResponse(result));
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Busca um produtor rural por id',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do produtor',
  })
  @ApiOkResponse({
    type: ProducerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produtor nao encontrado.',
  })
  findOne(@Param('id') id: string): Promise<ProducerResponseDto> {
    return this.producersService
      .findOne(id)
      .then((result) => ProducersHttpMapper.toResponse(result));
  }

  @Patch(':id')
  @Version('1')
  @ApiOperation({
    summary: 'Atualiza um produtor rural',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do produtor',
  })
  @ApiOkResponse({
    type: ProducerResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produtor nao encontrado.',
  })
  @ApiConflictResponse({
    description: 'Documento ja cadastrado.',
  })
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<ProducerResponseDto> {
    return this.producersService
      .update(id, ProducersHttpMapper.toUpdateCommand(updateProducerDto))
      .then((result) => ProducersHttpMapper.toResponse(result));
  }

  @Delete(':id')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove um produtor rural',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do produtor',
  })
  @ApiNoContentResponse({
    description: 'Produtor removido com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Produtor nao encontrado.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.producersService.remove(id);
  }
}
