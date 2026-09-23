import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ShoppingListStatus } from '../enums/shop-lists.enums';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    type: 'enum',
    enum: ShoppingListStatus,
    default: ShoppingListStatus.OPEN,
  })
  status!: ShoppingListStatus;

  @Column({
    name: 'budget_limit',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  budgetLimit!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
