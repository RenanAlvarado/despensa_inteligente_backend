import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ShoppingListItemStatus } from '../enums/shop-list-item.enum';

export class FindShopListItemsQueryDto extends PaginationQueryDto {
  // Nome do Produto
  @ApiPropertyOptional({
    example: 'Arroz',
    description: 'Filtra os itens pelo nome do produto.',
  })
  @IsString({ message: 'Nome do produto deve ser um texto.' })
  @IsOptional()
  productName?: string;

  // Status
  @ApiPropertyOptional({
    enum: ShoppingListItemStatus,
    example: ShoppingListItemStatus.PENDING,
    description: 'Filtra os itens pelo status da compra.',
  })
  @IsEnum(ShoppingListItemStatus, {
    message: 'Status deve ser PENDENTE, PARCIAL ou CONCLUIDO',
  })
  @ToUpperCase()
  @IsString({ message: 'O status precisa ser um texto.' })
  @IsOptional()
  status?: ShoppingListItemStatus;
}
