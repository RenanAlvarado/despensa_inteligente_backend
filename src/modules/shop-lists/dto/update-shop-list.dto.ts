import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { ShoppingListStatus } from '../enums/shop-lists.enums';
import { CreateShopListDto } from './create-shop-list.dto';

export class UpdateShopListDto extends PartialType(CreateShopListDto) {
  // Status
  @ApiPropertyOptional({
    enum: ShoppingListStatus,
    example: ShoppingListStatus.COMPLETED,
    description: 'Novo status da lista de compras.',
  })
  @IsEnum(ShoppingListStatus, {
    message: 'O status da lista é inválido. Aceitos: ABERTA, CONCLUIDA',
  })
  @ToUpperCase()
  @Trim()
  @IsString({ message: 'O Status deve ser um texto' })
  @IsOptional()
  status?: ShoppingListStatus;
}
