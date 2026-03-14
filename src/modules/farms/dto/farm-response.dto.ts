import { ApiProperty } from '@nestjs/swagger';

class FarmProducerSummaryDto {
  @ApiProperty({
    example: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
  })
  id!: string;

  @ApiProperty({
    example: '12345678901',
  })
  document!: string;

  @ApiProperty({
    example: 'Maria da Silva',
  })
  name!: string;
}

export class FarmResponseDto {
  @ApiProperty({
    example: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
  })
  id!: string;

  @ApiProperty({
    example: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
  })
  producerId!: string;

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

  @ApiProperty({
    example: 1000.5,
  })
  totalArea!: number;

  @ApiProperty({
    example: 700.25,
  })
  arableArea!: number;

  @ApiProperty({
    example: 300.25,
  })
  vegetationArea!: number;

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  updatedAt!: string;

  @ApiProperty({
    type: FarmProducerSummaryDto,
    required: false,
  })
  producer?: FarmProducerSummaryDto;
}
