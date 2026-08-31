import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { Trim } from './trim.decorator';

export function IsValidEmail() {
  return applyDecorators(
    IsEmail(
      {},
      {
        message: 'E-mail inválido.',
      },
    ),
    Trim(),
    IsString({
      message: 'O email deve ser uma string.',
    }),
  );
}
