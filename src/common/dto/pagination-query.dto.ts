import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../enums/order-filter.enum';

export class PaginationQueryDto {
  @Type(() => Number)
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  @IsInt({ message: 'Página deve ser um inteiro' })
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @Min(1, { message: 'Limite deve ser no mínimo 1' })
  @Max(100, { message: 'Limite deve ser no máximo 100' })
  @IsInt({ message: 'Limite deve ser um inteiro' })
  @IsOptional()
  limit?: number;

  @IsEnum(Order, {
    message: 'Ordenação deve ser ASC ou DESC',
  })
  @IsOptional()
  order?: Order;
}
