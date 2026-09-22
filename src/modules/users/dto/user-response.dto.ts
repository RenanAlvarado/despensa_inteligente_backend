import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID do usuário.',
  })
  id!: number;

  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail do usuário.',
  })
  email!: string;
}
