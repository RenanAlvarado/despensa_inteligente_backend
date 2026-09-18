import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindProductsQueryDto extends PaginationQueryDto {
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
}
