import { ApiProperty } from '@nestjs/swagger';

import { FarmResponseDto } from './farm-response.dto';

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

export class PaginatedFarmsResponseDto {
  @ApiProperty({
    type: [FarmResponseDto],
  })
  data!: FarmResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
