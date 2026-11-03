import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'testejoao5@gmail.com',
    description:
      'E-mail associado à conta para solicitar a recuperação de senha.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;
}
