import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { Trim } from './trim.decorator';

export function IsValidEmail() {
  return applyDecorators(
    IsString({
      message: 'O email deve ser uma string.',
    }),
    Trim(),
    IsEmail(
      {},
      {
        message: 'E-mail inválido.',
      },
    ),
  );
}
