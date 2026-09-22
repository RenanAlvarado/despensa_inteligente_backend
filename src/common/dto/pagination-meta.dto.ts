import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  // Páginas
  @ApiProperty({
    example: 1,
    description: 'Página atual.',
  })
  page!: number;

  //  Limite
  @ApiProperty({
    example: 10,
    description: 'Quantidade de registros por página.',
  })
  limit!: number;

  //   Total
  @ApiProperty({
    example: 37,
    description: 'Quantidade total de registros encontrados.',
  })
  total!: number;

  //  Páginas totais
  @ApiProperty({
    example: 4,
    description: 'Quantidade total de páginas.',
  })
  totalPages!: number;
}
