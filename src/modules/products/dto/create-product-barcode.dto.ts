import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateProductByBarcodeDto {
  @Matches(/^\d{13}$/, {
    message: 'O código de barras deve conter apenas números.',
  })
  @Length(13, 13, {
    message: 'O código de barras deve possuir exatamente 13 dígitos.',
  })
  @Trim()
  @IsString({
    message: 'O código de barras deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'O código de barras é obrigatório.',
  })
  barcode!: string;
}
