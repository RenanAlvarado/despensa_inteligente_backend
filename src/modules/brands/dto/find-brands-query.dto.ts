import { IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindBrandsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'Nestlé',
    description: 'Filtra marcas pelo nome.',
  })
  @Trim()
  @IsString({ message: 'Nome deve ser uma String' })
  @IsOptional()
  name?: string;
}
