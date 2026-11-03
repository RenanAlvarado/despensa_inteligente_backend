import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';

export class VerifyPasswordResetCodeDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description:
      'E-mail associado à conta que solicitou a recuperação de senha.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de seis dígitos recebido por e-mail.',
  })
  @IsNotEmpty({ message: 'Código é obrigatório.' })
  @Matches(/^\d{6}$/, {
    message: 'O código deve conter exatamente seis dígitos.',
  })
  code!: string;
}
