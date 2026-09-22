import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { CreateShopListItemDto } from './create-shop-list-item.dto';

export class UpdateShopListItemDto extends PartialType(CreateShopListItemDto) {
  // Preço Unitário
  @ApiPropertyOptional({
    example: 12.5,
    description: 'Preço unitário do produto.',
    minimum: 0,
  })
  @IsNumber(
    {},
    {
      message: 'O valor unitário precisa ser um número.',
    },
  )
  @Min(0, {
    message: 'O valor unitário não pode ser negativo.',
  })
  @IsOptional()
  unitPrice?: number;

  // Quantidade Comprada
  @ApiPropertyOptional({
    example: 2,
    description: 'Quantidade do produto que já foi comprada.',
    minimum: 0,
  })
  @Min(0, {
    message: 'A quantidade comprada não pode ser negativa.',
  })
  @IsInt({
    message: 'A quantidade comprada precisa ser um número inteiro.',
  })
  @IsOptional()
  purchasedQuantity?: number;
}
