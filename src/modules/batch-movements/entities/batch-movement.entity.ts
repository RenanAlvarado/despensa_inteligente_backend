import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Batch } from '../../batches/entities/batch.entity';
import { BatchMovementType } from '../enums/batch-movement.enums';

@Entity('batch_movements')
export class BatchMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'batch_id' })
  batchId!: number;

  @Column({
    type: 'enum',
    enum: BatchMovementType,
  })
  type!: BatchMovementType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  reason!: string | null;

  @Column({ type: 'int' })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Batch, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch!: Batch;
}
