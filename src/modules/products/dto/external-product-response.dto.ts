import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '../../../common/enums/unit-type.enum';

export class ExternalProductResponseDto {
  @ApiProperty({
    example: '7891000100103',
    nullable: true,
    description: 'Código de barras do produto.',
  })
  barcode!: string | null;

  @ApiProperty({
    example: 'Arroz Branco',
    nullable: true,
    description: 'Nome do produto.',
  })
  name!: string | null;

  @ApiProperty({
    example: 'Camil',
    nullable: true,
    description: 'Marca do produto.',
  })
  brand!: string | null;

  @ApiProperty({
    example: 'Arroz',
    nullable: true,
    description: 'Categoria do produto.',
  })
  category!: string | null;

  @ApiProperty({
    example: 5,
    nullable: true,
    description: 'Quantidade do produto.',
  })
  quantity!: number | null;

  @ApiProperty({
    enum: UnitType,
    example: UnitType.KG,
    nullable: true,
    description: 'Unidade de medida do produto.',
  })
  unit!: UnitType | null;

  @ApiProperty({
    example: 'https://images.openfoodfacts.org/images/products/...',
    nullable: true,
    description: 'URL da imagem do produto.',
  })
  imageUrl!: string | null;
}
