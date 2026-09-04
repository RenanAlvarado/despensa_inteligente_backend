import { ShoppingListItemStatus } from '../enums/shop-list-item.enum';

export class ShopListItemResponseDto {
  id!: number;

  shoppingListId!: number;

  productId!: number;

  requestedQuantity!: number;

  purchasedQuantity!: number;

  status!: ShoppingListItemStatus;

  notes!: string | null;

  unitPrice!: number | null;

  requestedTotal!: number | null;

  purchasedTotal!: number | null;

  createdAt!: Date;

  updatedAt!: Date;
}
