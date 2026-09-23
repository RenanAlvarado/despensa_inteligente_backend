import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
    description: 'Status atual da aplicação.',
  })
  status!: string;

  @ApiProperty({
    example: '2026-09-23T13:40:00.000Z',
    description: 'Data e hora em que a resposta foi gerada.',
  })
  timestamp!: string;
}
