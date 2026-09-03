import { PartialType } from '@nestjs/mapped-types';
import { CreateShopListDto } from './create-shop-list.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShoppingListStatus } from '../enums/shop-lists.enums';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';

export class UpdateShopListDto extends PartialType(CreateShopListDto) {
  @IsEnum(ShoppingListStatus, {
    message: 'O status da lista é inválido. Aceitos: ABERTA, CONCLUIDA',
  })
  @ToUpperCase()
  @Trim()
  @IsString({ message: 'O Status deve ser um texto' })
  @IsOptional()
  status?: ShoppingListStatus;
}
