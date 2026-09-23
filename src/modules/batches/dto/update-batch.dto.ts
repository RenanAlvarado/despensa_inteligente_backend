import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateBatchDto {
  // Data de Validade
  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Nova data de validade do lote.',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message: 'Data de validade deve ser uma data válida.',
    },
  )
  @IsOptional({
    message: 'Data de validade é obrigatória.',
  })
  expirationDate!: string;

  // Data de compra
  @ApiPropertyOptional({
    example: '2026-09-21',
    description: 'Nova data de compra do lote.',
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message: 'Data de compra deve ser uma data válida.',
    },
  )
  @IsOptional({
    message: 'Data de compra é obrigatória.',
  })
  purchaseDate!: string;

  // Preço unitário
  @ApiPropertyOptional({
    example: '13.90',
    description:
      'Novo preço unitário do produto. Deve possuir até duas casas decimais.',
  })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message:
      'Preço unitário deve ser um valor positivo com até 2 casas decimais.',
  })
  @IsOptional({
    message: 'Preço unitário é obrigatório.',
  })
  unitPrice!: string;

  // Notas
  @ApiPropertyOptional({
    example: 'Alteração de preço após nova compra.',
    description: 'Novas observações sobre o lote.',
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
