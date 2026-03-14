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

import { CreateProducerDto } from './dto/create-producer.dto';
import { ListProducersQueryDto } from './dto/list-producers-query.dto';
import { PaginatedProducersResponseDto } from './dto/paginated-producers-response.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducersService } from './producers.service';

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
    return this.producersService.create(createProducerDto);
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
    return this.producersService.findAll(query);
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
    return this.producersService.findOne(id);
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
    return this.producersService.update(id, updateProducerDto);
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
