import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateBatchDto {
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

  @Matches(/^\d+(\.\d{1,2})?$/, {
    message:
      'Preço unitário deve ser um valor positivo com até 2 casas decimais.',
  })
  @IsOptional({
    message: 'Preço unitário é obrigatório.',
  })
  unitPrice!: string;

  @MaxLength(1000, {
    message: 'Notas podem ter no máximo 1000 caracteres.',
  })
  @IsString({
    message: 'Notas devem ser uma string.',
  })
  @IsOptional()
  notes?: string;
}
