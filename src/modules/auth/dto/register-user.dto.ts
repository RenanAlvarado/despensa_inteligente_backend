import { IsValidPassword } from '../../../common/decorators/password.decorator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';
import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;

  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
