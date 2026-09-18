import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '../../../common/decorators/trim.decorator';
import { Order } from '../../../common/enums/order-filter.enum';

export class FindProductsQueryDto {
  @Trim()
  @IsString({ message: 'Nome deve ser uma String' })
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @Min(1, {
    message: 'ID da marca deve ser no mínimo 1',
  })
  @IsInt({
    message: 'ID da marca deve ser um inteiro',
  })
  @IsOptional()
  brandId?: number;

  @Type(() => Number)
  @Min(1, {
    message: 'ID da categoria deve ser no mínimo 1',
  })
  @IsInt({
    message: 'ID da categoria deve ser um inteiro',
  })
  @IsOptional()
  categoryId?: number;

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
