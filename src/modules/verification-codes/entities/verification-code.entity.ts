import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { VerificationCodePurpose } from '../enums/verification-code-purpose.enum';

@Entity('verification_codes')
@Index('IDX_verification_codes_user_purpose', ['userId', 'purpose'])
@Index('IDX_verification_codes_expires_at', ['expiresAt'])
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({
    name: 'code_hash',
    type: 'varchar',
    length: 255,
  })
  codeHash!: string;

  @Column({
    type: 'enum',
    enum: VerificationCodePurpose,
  })
  purpose!: VerificationCodePurpose;

  @Column({ name: 'expires_at', type: 'datetime', precision: 6 })
  expiresAt!: Date;

  @Column({ type: 'int', default: 0 })
  attempts!: number;

  @Column({
    name: 'consumed_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  consumedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
