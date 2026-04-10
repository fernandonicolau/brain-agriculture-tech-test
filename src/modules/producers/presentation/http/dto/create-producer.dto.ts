import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({
    example: '12345678901',
    description:
      'Documento do produtor. A validacao de CPF/CNPJ sera aplicada na regra de negocio.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  document!: string;

  @ApiProperty({
    example: 'Maria da Silva',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}
