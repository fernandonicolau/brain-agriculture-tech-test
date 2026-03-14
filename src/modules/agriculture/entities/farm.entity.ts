import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { Harvest } from './harvest.entity';
import { Producer } from './producer.entity';

@Entity({
  name: 'farms',
})
@Index('IDX_farms_state', ['state'])
@Index('IDX_farms_producer_id', ['producerId'])
@Check(
  'CHK_farms_area_usage',
  '"arable_area" >= 0 AND "vegetation_area" >= 0 AND "total_area" >= ("arable_area" + "vegetation_area")',
)
export class Farm extends BaseEntity {
  @Column({
    name: 'producer_id',
    type: 'uuid',
  })
  producerId!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 255,
  })
  city!: string;

  @Column({
    name: 'state',
    type: 'char',
    length: 2,
  })
  state!: string;

  @Column({
    name: 'total_area',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  totalArea!: string;

  @Column({
    name: 'arable_area',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  arableArea!: string;

  @Column({
    name: 'vegetation_area',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  vegetationArea!: string;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'producer_id',
  })
  producer!: Producer;

  @OneToMany(() => Harvest, (harvest) => harvest.farm)
  harvests!: Harvest[];
}
