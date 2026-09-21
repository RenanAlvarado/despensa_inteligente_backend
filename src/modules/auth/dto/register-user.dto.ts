import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';
import { IsValidPassword } from '../../../common/decorators/password.decorator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail utilizado para criar a conta.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: 'Senha123!',
    description: 'Senha utilizada para criar a conta.',
  })
  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
