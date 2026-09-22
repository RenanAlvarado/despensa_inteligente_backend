import { ApiProperty } from '@nestjs/swagger';

import { ShoppingListItemStatus } from '../enums/shop-list-item.enum';

export class ShopListItemResponseDto {
  // ID
  @ApiProperty({
    example: 1,
    description: 'ID do item da lista de compras.',
  })
  id!: number;

  // ID da lista de compras
  @ApiProperty({
    example: 1,
    description: 'ID da lista de compras à qual o item pertence.',
  })
  shoppingListId!: number;

  // ID do produto
  @ApiProperty({
    example: 5,
    description: 'ID do produto.',
  })
  productId!: number;

  // Quantidade Requisitada
  @ApiProperty({
    example: 3,
    description: 'Quantidade solicitada.',
  })
  requestedQuantity!: number;

  // Quantidade Comprada
  @ApiProperty({
    example: 2,
    description: 'Quantidade já comprada.',
  })
  purchasedQuantity!: number;

  // Status
  @ApiProperty({
    enum: ShoppingListItemStatus,
    example: ShoppingListItemStatus.PARTIAL,
    description: 'Status atual da compra do item.',
  })
  status!: ShoppingListItemStatus;

  // Notas
  @ApiProperty({
    example: 'Comprar até sexta-feira.',
    nullable: true,
    description: 'Observação do item.',
  })
  notes!: string | null;

  // Preço Unitário
  @ApiProperty({
    example: 12.5,
    nullable: true,
    description: 'Preço unitário do produto.',
  })
  unitPrice!: number | null;

  // Total Requisitado
  @ApiProperty({
    example: 37.5,
    nullable: true,
    description: 'Valor total correspondente à quantidade solicitada.',
  })
  requestedTotal!: number | null;

  // Total comprado
  @ApiProperty({
    example: 25,
    nullable: true,
    description: 'Valor total correspondente à quantidade comprada.',
  })
  purchasedTotal!: number | null;

  // Criado em
  @ApiProperty({
    example: '2026-09-21T18:30:00.000Z',
    description: 'Data de criação do item.',
  })
  createdAt!: Date;

  // Atualizado em
  @ApiProperty({
    example: '2026-09-21T19:00:00.000Z',
    description: 'Data da última atualização do item.',
  })
  updatedAt!: Date;
}
