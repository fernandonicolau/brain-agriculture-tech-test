import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
  })
  status!: 'ok';

  @ApiProperty({
    example: 'brain-agriculture-api',
  })
  service!: 'brain-agriculture-api';

  @ApiProperty({
    example: '2026-03-14T15:30:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    example: 'development',
  })
  environment!: string;

  @ApiProperty({
    example: 'up',
    required: false,
  })
  database?: 'up';
}
