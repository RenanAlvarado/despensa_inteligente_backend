import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidPassword } from '../../../common/decorators/password.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'Senha123!',
    description: 'Senha utilizada para redefinição.',
  })
  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
