import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';

export class ListFarmsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({
    example: '4d8b92d1-42a2-48a4-92f0-c20985060f54',
  })
  @IsOptional()
  @IsUUID()
  producerId?: string;

  @ApiPropertyOptional({
    example: 'MT',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @Length(2, 2)
  state?: string;

  @ApiPropertyOptional({
    example: 'Sorriso',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  city?: string;
}
