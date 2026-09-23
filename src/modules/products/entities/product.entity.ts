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
import { ProductSource } from '../enums/products.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'brand_id',
    nullable: true,
  })
  brandId!: number | null;

  @Column({
    name: 'category_id',
    nullable: true,
  })
  categoryId!: number | null;

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
    nullable: true,
  })
  unitType!: UnitType | null;

  @Column({
    name: 'unit_quantity',
    type: 'int',
    nullable: true,
  })
  unitQuantity!: number | null;

  @Column({
    type: 'enum',
    enum: ProductSource,
  })
  source!: ProductSource;

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
