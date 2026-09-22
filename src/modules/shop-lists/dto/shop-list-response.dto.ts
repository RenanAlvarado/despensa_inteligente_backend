import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShoppingListStatus } from '../enums/shop-lists.enums';

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
}
