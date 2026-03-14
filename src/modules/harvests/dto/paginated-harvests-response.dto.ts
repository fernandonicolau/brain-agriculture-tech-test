import { ApiProperty } from '@nestjs/swagger';

import { HarvestResponseDto } from './harvest-response.dto';

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

export class PaginatedHarvestsResponseDto {
  @ApiProperty({
    type: [HarvestResponseDto],
  })
  data!: HarvestResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
