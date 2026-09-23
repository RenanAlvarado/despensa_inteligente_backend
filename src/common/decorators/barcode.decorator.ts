import { applyDecorators } from '@nestjs/common';
import { IsString, Length, Matches } from 'class-validator';
import { Trim } from './trim.decorator';

export function IsValidBarcode() {
  return applyDecorators(
    IsString({
      message: 'O código de barras deve ser uma string.',
    }),
    Trim(),
    Matches(/^\d+$/, {
      message: 'O código de barras deve conter apenas números.',
    }),
    Length(13, 13, {
      message: 'O código de barras deve possuir exatamente 13 dígitos.',
    }),
  );
}
