import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidBarcode } from '../../../common/decorators/barcode.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { UnitType } from '../../../common/enums/unit-type.enum';

export class CreateProductManualDto {
  // ID da Marca
  @ApiProperty({
    example: 1,
    description: 'ID da marca do produto.',
    minimum: 1,
  })
  @Min(1, { message: 'ID da marca deve ser no mínimo 1' })
  @IsInt({ message: 'ID da marca deve ser um inteiro' })
  @IsNotEmpty({ message: 'ID da Marca é Obrigatório' })
  brandId!: number;

  // ID da categoria
  @ApiProperty({
    example: 1,
    description: 'ID da categoria do produto.',
    minimum: 1,
  })
  @Min(1, { message: 'ID da categoria deve ser no mínimo 1' })
  @IsInt({ message: 'ID da categoria deve ser um inteiro' })
  @IsNotEmpty({ message: 'ID da Categoria é Obrigatório' })
  categoryId!: number;

  // Nome
  @ApiProperty({
    example: 'Arroz',
    description: 'Nome do produto.',
    maxLength: 150,
  })
  @MaxLength(150, {
    message: 'Nome do Produto pode ter no máximo 150 caractéres',
  })
  @Trim()
  @IsString({ message: 'Nome do Produto deve ser uma String' })
  @IsNotEmpty({ message: 'Nome do Produto é Obrigatório' })
  name!: string;

  // Código de Barras
  @ApiPropertyOptional({
    example: '7891000100103',
    description:
      'Código de barras EAN-13. Quando informado, será consultado na API externa.',
  })
  @IsValidBarcode()
  @IsOptional()
  barcode?: string;

  // URL da Imagem
  @ApiPropertyOptional({
    example: 'https://exemplo.com/arroz.jpg',
    description: 'URL da imagem do produto.',
    maxLength: 500,
  })
  @MaxLength(500, {
    message: 'URL da Imagem deve ter no máximo 500 caractéres',
  })
  @IsUrl(undefined, { message: 'URL Inválida' })
  @Trim()
  @IsString({ message: 'URL da Imagem deve ser String' })
  @IsOptional()
  imageUrl?: string;

  // Tipo da Unidade
  @ApiProperty({
    enum: UnitType,
    example: UnitType.KG,
    description: 'Tipo de unidade utilizada pelo produto.',
  })
  @IsEnum(UnitType, {
    message: 'Tipo de Unidade não aceito, apenas: KG, L, UN',
  })
  @IsNotEmpty({ message: 'Tipo da Unidade é Obrigatório' })
  unitType!: UnitType;

  // Quantidade da Unidade
  @ApiProperty({
    example: 5,
    description: 'Quantidade correspondente à unidade do produto.',
    minimum: 1,
  })
  @Min(1, { message: 'Quantidade da unidade deve ser no mínimo 1' })
  @IsInt({ message: 'Quantidade da unidade ser Inteiro' })
  @IsNotEmpty({ message: 'Quantidade é Obrigatório' })
  unitQuantity!: number;
}
