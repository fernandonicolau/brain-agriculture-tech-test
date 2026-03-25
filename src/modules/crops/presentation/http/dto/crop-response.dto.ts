import { ApiProperty } from '@nestjs/swagger';

export class CropResponseDto {
  @ApiProperty({
    example: 'd93720cc-2802-4105-a55e-f56c9e2cfc43',
  })
  id!: string;

  @ApiProperty({
    example: 'Soja',
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
