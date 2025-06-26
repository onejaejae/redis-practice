import { Entity, Column } from 'typeorm';
import { UuidEntity } from 'src/core/database/typeorm/base.entity';

@Entity('user')
export class User extends UuidEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  score: number;
}
