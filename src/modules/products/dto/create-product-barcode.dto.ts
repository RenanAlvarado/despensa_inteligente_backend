import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateProductByBarcodeDto {
  @IsString({
    message: 'O código de barras deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'O código de barras é obrigatório.',
  })
  @Length(13, 13, {
    message: 'O código de barras deve possuir exatamente 13 dígitos.',
  })
  @Matches(/^\d{13}$/, {
    message: 'O código de barras deve conter apenas números.',
  })
  barcode!: string;
}
