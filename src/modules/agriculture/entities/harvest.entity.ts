import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { Farm } from './farm.entity';
import { HarvestCrop } from './harvest-crop.entity';

@Entity({
  name: 'harvests',
})
@Index('IDX_harvests_farm_id', ['farmId'])
@Index('IDX_harvests_year', ['year'])
export class Harvest extends BaseEntity {
  @Column({
    name: 'farm_id',
    type: 'uuid',
  })
  farmId!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    name: 'year',
    type: 'int',
  })
  year!: number;

  @ManyToOne(() => Farm, (farm) => farm.harvests, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'farm_id',
  })
  farm!: Farm;

  @OneToMany(() => HarvestCrop, (harvestCrop) => harvestCrop.harvest)
  harvestCrops!: HarvestCrop[];
}
