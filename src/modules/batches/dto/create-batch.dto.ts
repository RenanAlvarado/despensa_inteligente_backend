import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBatchDto {
  // ID do produto
  @ApiProperty({
    example: 1,
    description: 'ID do produto ao qual o lote pertence.',
    minimum: 1,
  })
  @Min(1, {
    message: 'ID do produto deve ser no mínimo 1.',
  })
  @IsInt({
    message: 'ID do produto deve ser um inteiro.',
  })
  @IsNotEmpty({
    message: 'ID do produto é obrigatório.',
  })
  productId!: number;

  // Data de Validade
  @ApiProperty({
    example: '2026-12-31',
    description: 'Data de validade do lote.',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message: 'Data de validade deve ser uma data válida.',
    },
  )
  @IsNotEmpty({
    message: 'Data de validade é obrigatória.',
  })
  expirationDate!: string;

  // Data de compra
  @ApiProperty({
    example: '2026-09-21',
    description: 'Data em que o produto foi comprado.',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message: 'Data de compra deve ser uma data válida.',
    },
  )
  @IsNotEmpty({
    message: 'Data de compra é obrigatória.',
  })
  purchaseDate!: string;

  // Quantidade
  @ApiProperty({
    example: 5,
    description: 'Quantidade de unidades do produto no lote.',
    minimum: 1,
  })
  @Min(1, {
    message: 'Quantidade deve ser no mínimo 1.',
  })
  @IsInt({
    message: 'Quantidade deve ser um inteiro.',
  })
  @IsNotEmpty({
    message: 'Quantidade é obrigatória.',
  })
  quantity!: number;

  // Preço unitário
  @ApiProperty({
    example: '12.50',
    description:
      'Preço unitário do produto. Deve possuir até duas casas decimais.',
  })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message:
      'Preço unitário deve ser um valor positivo com até 2 casas decimais.',
  })
  @IsNotEmpty({
    message: 'Preço unitário é obrigatório.',
  })
  unitPrice!: string;

  // Notas
  @ApiPropertyOptional({
    example: 'Lote comprado em promoção.',
    description: 'Observações adicionais sobre o lote.',
    maxLength: 1000,
  })
  @MaxLength(1000, {
    message: 'Notas podem ter no máximo 1000 caracteres.',
  })
  @IsString({
    message: 'Notas devem ser uma string.',
  })
  @IsOptional()
  notes?: string;
}
