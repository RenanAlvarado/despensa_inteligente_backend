import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../enums/order-filter.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número da página.',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  @IsInt({ message: 'Página deve ser um inteiro' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de registros por página.',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @Min(1, { message: 'Limite deve ser no mínimo 1' })
  @Max(100, { message: 'Limite deve ser no máximo 100' })
  @IsInt({ message: 'Limite deve ser um inteiro' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    enum: Order,
    example: Order.ASC,
    description: 'Direção da ordenação.',
    default: Order.ASC,
  })
  @IsEnum(Order, {
    message: 'Ordenação deve ser ASC ou DESC',
  })
  @IsOptional()
  order?: Order;
}
