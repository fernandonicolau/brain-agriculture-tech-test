import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    example: '9ff97f6f-b474-4e6f-8d26-3ffbc367bfe3',
  })
  @IsUUID()
  farmId!: string;

  @ApiProperty({
    example: 'Safra 2024/2025',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    example: 2024,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year!: number;
}
