import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBatchDto {
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

  @IsNotEmpty({
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
