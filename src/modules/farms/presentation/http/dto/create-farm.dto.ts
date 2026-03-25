import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({
    example: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
  })
  @IsUUID()
  producerId!: string;

  @ApiProperty({
    example: 'Fazenda Primavera',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    example: 'Sorriso',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city!: string;

  @ApiProperty({
    example: 'MT',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @Length(2, 2)
  state!: string;

  @ApiProperty({
    example: 1000.5,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalArea!: number;

  @ApiProperty({
    example: 700.25,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  arableArea!: number;

  @ApiProperty({
    example: 300.25,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  vegetationArea!: number;
}
