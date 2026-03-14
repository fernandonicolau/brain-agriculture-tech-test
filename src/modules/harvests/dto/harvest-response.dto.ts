import { ApiProperty } from '@nestjs/swagger';

import { CropResponseDto } from '../../crops/dto/crop-response.dto';

class HarvestFarmSummaryDto {
  @ApiProperty({
    example: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
  })
  id!: string;

  @ApiProperty({
    example: 'Fazenda Primavera',
  })
  name!: string;

  @ApiProperty({
    example: 'Sorriso',
  })
  city!: string;

  @ApiProperty({
    example: 'MT',
  })
  state!: string;
}

export class HarvestResponseDto {
  @ApiProperty({
    example: '7a8d4af5-f9b8-4d6a-b334-4493accc5101',
  })
  id!: string;

  @ApiProperty({
    example: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
  })
  farmId!: string;

  @ApiProperty({
    example: 'Safra 2024/2025',
  })
  name!: string;

  @ApiProperty({
    example: 2024,
  })
  year!: number;

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  updatedAt!: string;

  @ApiProperty({
    type: HarvestFarmSummaryDto,
    required: false,
  })
  farm?: HarvestFarmSummaryDto;

  @ApiProperty({
    type: [CropResponseDto],
    required: false,
  })
  crops?: CropResponseDto[];
}
