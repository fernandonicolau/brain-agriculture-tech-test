import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { CreateProducerDto } from './create-producer.dto';

export class UpdateProducerDto extends PartialType(CreateProducerDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  declare document?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  declare name?: string;
}
