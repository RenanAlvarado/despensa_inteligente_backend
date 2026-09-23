import { ApiPropertyOptional } from '@nestjs/swagger';
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
import { Trim } from '../../../common/decorators/trim.decorator';
import { UnitType } from '../../../common/enums/unit-type.enum';

export class UpdateProductDto {
  // Id da marca
  @ApiPropertyOptional({
    example: 1,
    description: 'ID da nova marca do produto.',
    minimum: 1,
  })
  @Min(1, { message: 'ID da marca deve ser no mínimo 1' })
  @IsInt({ message: 'ID da marca deve ser um inteiro' })
  @IsOptional()
  brandId?: number;

  // Id da categoria
  @ApiPropertyOptional({
    example: 1,
    description: 'ID da nova categoria do produto.',
    minimum: 1,
  })
  @Min(1, { message: 'ID da categoria deve ser no mínimo 1' })
  @IsInt({ message: 'ID da categoria deve ser um inteiro' })
  @IsOptional()
  categoryId?: number;

  // Nome
  @ApiPropertyOptional({
    example: 'Arroz Integral',
    description: 'Novo nome do produto.',
    maxLength: 150,
  })
  @MaxLength(150, {
    message: 'Nome do Produto pode ter no máximo 150 caracteres',
  })
  @Trim()
  @IsString({ message: 'Nome do Produto deve ser uma String' })
  @IsNotEmpty({ message: 'Nome do Produto é Obrigatório' })
  @IsOptional()
  name?: string;

  // Url da Imagem
  @ApiPropertyOptional({
    example: 'https://exemplo.com/arroz-integral.jpg',
    description: 'Nova URL da imagem do produto.',
    maxLength: 500,
  })
  @MaxLength(500, {
    message: 'URL da Imagem deve ter no máximo 500 caracteres',
  })
  @IsUrl(undefined, { message: 'URL Inválida' })
  @Trim()
  @IsString({ message: 'URL da Imagem deve ser String' })
  @IsOptional()
  imageUrl?: string;

  // Tipo da Unidade
  @ApiPropertyOptional({
    enum: UnitType,
    example: UnitType.KG,
    description: 'Novo tipo de unidade do produto.',
  })
  @IsEnum(UnitType, {
    message: 'Tipo de Unidade não aceito, apenas: KG, L, UN',
  })
  @IsOptional()
  unitType?: UnitType;

  // Quantidade da Unidade
  @ApiPropertyOptional({
    example: 5,
    description: 'Nova quantidade correspondente à unidade do produto.',
    minimum: 1,
  })
  @Min(1, {
    message: 'Quantidade da unidade deve ser no mínimo 1',
  })
  @IsInt({
    message: 'Quantidade da unidade deve ser um inteiro',
  })
  @IsOptional()
  unitQuantity?: number;
}
