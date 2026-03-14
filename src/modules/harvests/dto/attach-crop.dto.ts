import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AttachCropDto {
  @ApiProperty({
    example: 'd93720cc-2802-4105-a55e-f56c9e2cfc43',
  })
  @IsUUID()
  cropId!: string;
}
