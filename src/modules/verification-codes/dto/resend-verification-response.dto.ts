import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationResponseDto {
  @ApiProperty({
    example:
      'Se a conta existir e estiver pendente de confirmação, você receberá um código por e-mail, caso a solicitação possa ser atendida.',
    description: 'Mensagem genérica para preservar a segurança da conta.',
  })
  message!: string;
}
