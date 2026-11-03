import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'testejoao5@gmail.com',
    description: 'E-mail utilizado no cadastro.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: '048251',
    description: 'Código numérico de seis dígitos recebido por e-mail.',
  })
  @Matches(/^\d{6}$/, {
    message: 'O código deve conter exatamente seis dígitos.',
  })
  @Trim()
  @IsNotEmpty({ message: 'Código é obrigatório.' })
  code!: string;
}
