import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';
import { IsValidPassword } from '../../../common/decorators/password.decorator';

export class LoginDto {
  @ApiProperty({
    example: 'testejoao5@gmail.com',
    description: 'Email utilizado para autenticação.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: 'Joao123@',
    description: 'Senha do usuário.',
  })
  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
