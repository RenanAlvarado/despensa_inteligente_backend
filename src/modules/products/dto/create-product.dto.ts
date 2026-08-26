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

import { UnitType } from '../../../common/enums/unit-type.enum';

export class CreateProductDto {
  @IsInt({ message: 'ID da marca deve ser um inteiro' })
  @Min(1, { message: 'ID da marca deve ser no mínimo 1' })
  brandId!: number;

  @IsInt({ message: 'ID da categoria deve ser um inteiro' })
  @Min(1, { message: 'ID da categoria deve ser no mínimo 1' })
  categoryId!: number;

  @IsString({ message: 'Nome do Produto deve ser uma String' })
  @IsNotEmpty({ message: 'Nome do Produto é Obrigatório' })
  @MaxLength(150, {
    message: 'Nome do Produto pode ter no máximo 150 caractéres',
  })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Código de barras deve ser string' })
  @MaxLength(100, {
    message: 'Código de barras deve ter no máximo 100 caractéres',
  })
  barcode?: string;

  @IsString({ message: 'URL da Imagem deve ser String' })
  @IsUrl(undefined, { message: 'URL Inválida' })
  @MaxLength(500, {
    message: 'URL da Imagem deve ter no máximo 500 caractéres',
  })
  imageUrl!: string;

  @IsEnum(UnitType, {
    message: 'Tipo de Unidade não aceito, apenas: KG, L, UN',
  })
  unitType!: UnitType;

  @IsInt({ message: 'Quantidade da unidade ser Inteiro' })
  @Min(1, { message: 'Quantidade da unidade deve ser no mínimo 1' })
  unitQuantity!: number;
}
