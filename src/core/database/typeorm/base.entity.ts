import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export class BaseTimeEntity {
  @Expose()
  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}

export class UuidEntity extends BaseTimeEntity {
  @Expose()
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @BeforeInsert()
  generateUuid() {
    if (!this.id) this.id = v4();
  }
}
