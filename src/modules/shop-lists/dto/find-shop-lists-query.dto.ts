import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ShoppingListStatus } from '../enums/shop-lists.enums';

export class FindShopListsQueryDto extends PaginationQueryDto {
  // Nome
  @ApiPropertyOptional({
    example: 'Compras',
    description: 'Filtra as listas pelo nome.',
  })
  @IsString({ message: 'Nome deve ser uma string.' })
  @IsOptional()
  name?: string;

  // Status
  @ApiPropertyOptional({
    enum: ShoppingListStatus,
    example: ShoppingListStatus.OPEN,
    description: 'Filtra as listas pelo status.',
  })
  @IsEnum(ShoppingListStatus, {
    message: 'O status é inválido. Valores aceitos: ABERTA, CONCLUIDA',
  })
  @ToUpperCase()
  @IsString({ message: 'O status precisa ser um texto.' })
  @IsOptional()
  status?: ShoppingListStatus;
}
