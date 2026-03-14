import { ApiProperty } from '@nestjs/swagger';

import { ProducerResponseDto } from './producer-response.dto';

class PaginationMetaDto {
  @ApiProperty({
    example: 1,
  })
  page!: number;

  @ApiProperty({
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    example: 1,
  })
  total!: number;
}

export class PaginatedProducersResponseDto {
  @ApiProperty({
    type: [ProducerResponseDto],
  })
  data!: ProducerResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
