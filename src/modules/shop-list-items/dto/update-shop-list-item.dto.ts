import { PartialType } from '@nestjs/mapped-types';
import { CreateShopListItemDto } from './create-shop-list-item.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

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
}
