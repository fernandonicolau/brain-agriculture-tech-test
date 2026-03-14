import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { HarvestCrop } from './harvest-crop.entity';

@Entity({
  name: 'crops',
})
export class Crop extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @OneToMany(() => HarvestCrop, (harvestCrop) => harvestCrop.crop)
  harvestCrops!: HarvestCrop[];
}
