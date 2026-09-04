import { PartialType } from '@nestjs/mapped-types';
import { CreateShopListItemDto } from './create-shop-list-item.dto';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateShopListItemDto extends PartialType(CreateShopListItemDto) {
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

  @Min(0, {
    message: 'A quantidade comprada não pode ser negativa.',
  })
  @IsInt({
    message: 'A quantidade comprada precisa ser um número inteiro.',
  })
  @IsOptional()
  purchasedQuantity?: number;
}
