import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MinLength } from 'class-validator';
import { Trim } from './trim.decorator';

export function IsValidPassword() {
  return applyDecorators(
    IsString({
      message: 'A senha deve ser uma string.',
    }),
    Trim(),
    MinLength(8, {
      message: 'A senha deve possuir pelo menos 8 caracteres.',
    }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9-]).+$/, {
      message:
        'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    }),
  );
}
