import { ApiProperty } from '@nestjs/swagger';

export class AuthMessageResponseDto {
  @ApiProperty({
    description: 'Mensagem referente à operação de autenticação.',
    example: 'E-mail confirmado com sucesso.',
  })
  message!: string;
}
