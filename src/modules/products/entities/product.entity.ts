import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { UnitType } from '../../../common/enums/unit-type.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'brand_id' })
  brandId!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({
    name: 'barcode',
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  barcode!: string | null;

  @Column({
    name: 'image_url',
    type: 'varchar',
    nullable: true,
    length: 500,
  })
  imageUrl!: string | null;

  @Column({
    name: 'unit_type',
    type: 'enum',
    enum: UnitType,
  })
  unitType!: UnitType;

  @Column({
    name: 'unit_quantity',
    type: 'int',
  })
  unitQuantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category!: Category;
}
