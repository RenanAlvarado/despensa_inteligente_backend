import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetTokenResponseDto {
  @ApiProperty({
    description:
      'Token temporário utilizado exclusivamente para redefinir a senha.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  resetToken!: string;
}
