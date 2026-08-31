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
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateProductManualDto {
  @Min(1, { message: 'ID da marca deve ser no mínimo 1' })
  @IsInt({ message: 'ID da marca deve ser um inteiro' })
  @IsNotEmpty({ message: 'ID da Marca é Obrigatório' })
  brandId!: number;

  @Min(1, { message: 'ID da categoria deve ser no mínimo 1' })
  @IsInt({ message: 'ID da categoria deve ser um inteiro' })
  @IsNotEmpty({ message: 'ID da Categoria é Obrigatório' })
  categoryId!: number;

  @MaxLength(150, {
    message: 'Nome do Produto pode ter no máximo 150 caractéres',
  })
  @Trim()
  @IsString({ message: 'Nome do Produto deve ser uma String' })
  @IsNotEmpty({ message: 'Nome do Produto é Obrigatório' })
  name!: string;

  @MaxLength(100, {
    message: 'Código de barras deve ter no máximo 100 caractéres',
  })
  @Trim()
  @IsString({ message: 'Código de barras deve ser string' })
  @IsOptional()
  barcode?: string;

  @MaxLength(500, {
    message: 'URL da Imagem deve ter no máximo 500 caractéres',
  })
  @IsUrl(undefined, { message: 'URL Inválida' })
  @Trim()
  @IsString({ message: 'URL da Imagem deve ser String' })
  @IsOptional()
  imageUrl?: string;

  @IsEnum(UnitType, {
    message: 'Tipo de Unidade não aceito, apenas: KG, L, UN',
  })
  @IsNotEmpty({ message: 'Tipo da Unidade é Obrigatório' })
  unitType!: UnitType;

  @Min(1, { message: 'Quantidade da unidade deve ser no mínimo 1' })
  @IsInt({ message: 'Quantidade da unidade ser Inteiro' })
  @IsNotEmpty({ message: 'Quantidade é Obrigatório' })
  unitQuantity!: number;
}
