import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindCategoriesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'Bebidas',
    description: 'Filtra categorias pelo nome.',
  })
  @Trim()
  @IsString({ message: 'Nome deve ser uma String' })
  @IsOptional()
  name?: string;
}
