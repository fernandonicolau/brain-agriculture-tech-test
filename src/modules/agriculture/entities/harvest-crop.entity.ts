import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { Crop } from './crop.entity';
import { Harvest } from './harvest.entity';

@Entity({
  name: 'harvest_crops',
})
@Unique('UQ_harvest_crops_harvest_id_crop_id', ['harvestId', 'cropId'])
@Index('IDX_harvest_crops_harvest_id', ['harvestId'])
@Index('IDX_harvest_crops_crop_id', ['cropId'])
export class HarvestCrop extends BaseEntity {
  @Column({
    name: 'harvest_id',
    type: 'uuid',
  })
  harvestId!: string;

  @Column({
    name: 'crop_id',
    type: 'uuid',
  })
  cropId!: string;

  @ManyToOne(() => Harvest, (harvest) => harvest.harvestCrops, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'harvest_id',
  })
  harvest!: Harvest;

  @ManyToOne(() => Crop, (crop) => crop.harvestCrops, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'crop_id',
  })
  crop!: Crop;
}
