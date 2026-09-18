import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BatchSortBy } from '../enums/batches-enums.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindBatchesQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @Min(1, { message: 'ID do produto deve ser no mínimo 1' })
  @IsInt({ message: 'ID do produto deve ser um inteiro' })
  @IsOptional()
  productId?: number;

  @IsEnum(BatchSortBy, {
    message:
      'Campo de ordenação inválido. Use: purchaseDate, expirationDate, quantity ou unitPrice',
  })
  @IsOptional()
  sortBy?: BatchSortBy;
}
