import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../common/database/entities/base.entity';
import { Farm } from './farm.entity';

@Entity({
  name: 'producers',
})
export class Producer extends BaseEntity {
  @Index('UQ_producers_document', { unique: true })
  @Column({
    name: 'document',
    type: 'varchar',
    length: 20,
  })
  document!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  farms!: Farm[];
}
