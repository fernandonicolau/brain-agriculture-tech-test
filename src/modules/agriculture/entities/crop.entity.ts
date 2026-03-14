import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { HarvestCrop } from './harvest-crop.entity';

@Entity({
  name: 'crops',
})
export class Crop extends BaseEntity {
  @Index('UQ_crops_name', { unique: true })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @OneToMany(() => HarvestCrop, (harvestCrop) => harvestCrop.crop)
  harvestCrops!: HarvestCrop[];
}
