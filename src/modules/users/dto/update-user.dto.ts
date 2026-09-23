import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidPassword } from '../../../common/decorators/password.decorator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'NovaSenha123!',
    description: 'Nova senha do usuário.',
  })
  @IsValidPassword()
  @IsNotEmpty({
    message: 'A senha é obrigatória.',
  })
  password!: string;
}
