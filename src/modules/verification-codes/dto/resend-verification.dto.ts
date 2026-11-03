import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsValidEmail } from '../../../common/decorators/email.decorator';

export class ResendVerificationDto {
  @ApiProperty({
    example: 'testejoao5@gmail.com',
    description: 'E-mail utilizado para solicitar o reenvio do código.',
  })
  @IsValidEmail()
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  email!: string;
}
