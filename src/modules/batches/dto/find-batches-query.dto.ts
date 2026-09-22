import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { BatchSortBy } from '../enums/batches-enums.enum';

export class FindBatchesQueryDto extends PaginationQueryDto {
  // ID do produto
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtra os lotes pelo ID do produto.',
    minimum: 1,
  })
  @Type(() => Number)
  @Min(1, { message: 'ID do produto deve ser no mínimo 1' })
  @IsInt({ message: 'ID do produto deve ser um inteiro' })
  @IsOptional()
  productId?: number;

  // Ordenar Por
  @ApiPropertyOptional({
    enum: BatchSortBy,
    example: BatchSortBy.PURCHASE_DATE,
    description: 'Campo utilizado para ordenar os lotes.',
  })
  @IsEnum(BatchSortBy, {
    message:
      'Campo de ordenação inválido. Use: purchaseDate, expirationDate, quantity ou unitPrice',
  })
  @IsOptional()
  sortBy?: BatchSortBy;
}
