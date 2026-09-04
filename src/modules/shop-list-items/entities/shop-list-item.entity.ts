import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ShoppingList } from '../../shop-lists/entities/shop-list.entity';
import { Product } from '../../products/entities/product.entity';
import { ShoppingListItemStatus } from '../enums/shop-list-item.enum';

@Entity('shopping_list_items')
@Unique('UQ_shopping_list_product', ['shoppingListId', 'productId'])
export class ShopListItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'shopping_list_id' })
  shoppingListId!: number;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'requested_quantity', type: 'int' })
  requestedQuantity!: number;

  @Column({
    name: 'purchased_quantity',
    type: 'int',
    default: 0,
  })
  purchasedQuantity!: number;

  @Column({
    type: 'enum',
    enum: ShoppingListItemStatus,
    default: ShoppingListItemStatus.PENDING,
  })
  status!: ShoppingListItemStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitPrice!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => ShoppingList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shopping_list_id' })
  shoppingList!: ShoppingList;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
