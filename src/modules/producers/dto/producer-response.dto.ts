import { ApiProperty } from '@nestjs/swagger';

export class ProducerResponseDto {
  @ApiProperty({
    example: 'f9d4ec4a-8e1e-49ee-b8a2-a14b6d3bb303',
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

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-03-14T18:45:00.000Z',
  })
  updatedAt!: string;
}
