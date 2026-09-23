import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindExternalProductsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    example: 'Arroz',
    description: 'Nome ou termo utilizado para buscar produtos.',
  })
  @Trim()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, {
    message: 'Nome deve conter pelo menos 2 caracteres',
  })
  name!: string;
}
