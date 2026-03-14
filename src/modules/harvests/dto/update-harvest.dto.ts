import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

import { CreateHarvestDto } from './create-harvest.dto';

export class UpdateHarvestDto extends PartialType(CreateHarvestDto) {
  @IsOptional()
  @IsUUID()
  declare farmId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  declare name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  declare year?: number;
}
