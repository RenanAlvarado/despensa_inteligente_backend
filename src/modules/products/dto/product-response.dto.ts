import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitType } from '../../../common/enums/unit-type.enum';
import { BrandResponseDto } from '../../brands/dto/brand-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { ProductSource } from '../enums/products.enum';

export class ProductResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto.',
  })
  id!: number;

  @ApiProperty({
    example: 'Arroz Integral',
    description: 'Nome do produto.',
  })
  name!: string;

  @ApiPropertyOptional({
    example: '7891234567890',
    description: 'Código de barras do produto.',
    nullable: true,
  })
  barcode!: string | null;

  @ApiPropertyOptional({
    example: 'https://exemplo.com/arroz.jpg',
    description: 'URL da imagem do produto.',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiPropertyOptional({
    example: 'KG',
    description: 'Unidade de medida do produto.',
    enum: UnitType,
    nullable: true,
  })
  unitType!: UnitType | null;

  @ApiPropertyOptional({
    example: 5,
    description: 'Quantidade correspondente à unidade de medida.',
    nullable: true,
  })
  unitQuantity!: number | null;

  @ApiProperty({
    example: 'OPEN_FOOD_FACTS',
    description: 'Fonte dos dados do produto.',
    enum: ProductSource,
  })
  source!: ProductSource;

  @ApiPropertyOptional({
    type: BrandResponseDto,
    nullable: true,
  })
  brand!: BrandResponseDto | null;

  @ApiPropertyOptional({
    type: CategoryResponseDto,
    nullable: true,
  })
  category!: CategoryResponseDto | null;
}
