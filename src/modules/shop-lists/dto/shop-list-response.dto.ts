import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ShopListBudgetStatus,
  ShoppingListStatus,
} from '../enums/shop-lists.enums';

export class ShoppingListResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID da lista de compras.',
  })
  id!: number;

  @ApiProperty({
    example: 'Compras da semana',
    description: 'Nome da lista de compras.',
  })
  name!: string;

  @ApiProperty({
    enum: ShoppingListStatus,
    example: ShoppingListStatus.OPEN,
    description: 'Status atual da lista de compras.',
  })
  status!: ShoppingListStatus;

  @ApiPropertyOptional({
    example: 250.5,
    description: 'Limite máximo de orçamento da lista de compras.',
    nullable: true,
  })
  budgetLimit!: number | null;

  @ApiProperty({
    example: 125.75,
    description: 'Valor total já gasto com os itens comprados.',
  })
  spentTotal!: number;

  @ApiPropertyOptional({
    example: 124.25,
    description:
      'Diferença entre o orçamento e o valor gasto. Negativa quando ultrapassado.',
    nullable: true,
  })
  budgetDifference!: number | null;

  @ApiProperty({
    enum: ShopListBudgetStatus,
    example: ShopListBudgetStatus.WITHIN_BUDGET,
    description: 'Situação atual do orçamento da lista.',
  })
  budgetStatus!: ShopListBudgetStatus;
}
