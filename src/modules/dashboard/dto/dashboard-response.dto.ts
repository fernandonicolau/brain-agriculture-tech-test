import { ApiProperty } from '@nestjs/swagger';

class DashboardTotalsDto {
  @ApiProperty({
    example: 10,
  })
  farms!: number;

  @ApiProperty({
    example: 12345,
  })
  totalHectares!: number;
}

class DashboardByStateDto {
  @ApiProperty({
    example: 'MG',
  })
  state!: string;

  @ApiProperty({
    example: 4,
  })
  count!: number;
}

class DashboardByCropDto {
  @ApiProperty({
    example: 'Soja',
  })
  crop!: string;

  @ApiProperty({
    example: 7,
  })
  count!: number;
}

class DashboardLandUseDto {
  @ApiProperty({
    example: 8000,
  })
  arableArea!: number;

  @ApiProperty({
    example: 4345,
  })
  vegetationArea!: number;
}

export class DashboardResponseDto {
  @ApiProperty({
    type: DashboardTotalsDto,
  })
  totals!: DashboardTotalsDto;

  @ApiProperty({
    type: [DashboardByStateDto],
  })
  byState!: DashboardByStateDto[];

  @ApiProperty({
    type: [DashboardByCropDto],
  })
  byCrop!: DashboardByCropDto[];

  @ApiProperty({
    type: DashboardLandUseDto,
  })
  landUse!: DashboardLandUseDto;
}
