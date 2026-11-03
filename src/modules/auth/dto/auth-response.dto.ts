import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description:
      'Token JWT de acesso. Retornado somente quando o e-mail está confirmado.',
  })
  token?: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o usuário confirmou o endereço de e-mail.',
  })
  emailVerified!: boolean;
}
