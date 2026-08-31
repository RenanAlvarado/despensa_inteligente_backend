import { IsNotEmpty } from 'class-validator';
import { IsValidPassword } from '../../../common/decorators/password.decorator';

export class UpdateUserDto {
  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
