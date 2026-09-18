import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ShoppingListItemStatus } from '../enums/shop-list-item.enum';

export class FindShopListItemsQueryDto extends PaginationQueryDto {
  @IsString({ message: 'Nome do produto deve ser um texto.' })
  @IsOptional()
  productName?: string;

  @IsEnum(ShoppingListItemStatus, {
    message: 'Status deve ser PENDENTE, PARCIAL ou CONCLUIDO',
  })
  @ToUpperCase()
  @IsString({ message: 'O status precisa ser um texto.' })
  @IsOptional()
  status?: ShoppingListItemStatus;
}
