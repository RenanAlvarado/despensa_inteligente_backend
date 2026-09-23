import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateShopListItemDto {
  // ID do produto
  @ApiProperty({
    example: 1,
    description: 'ID do produto que será adicionado à lista de compras.',
    minimum: 1,
  })
  @IsInt({
    message: 'O ID do produto precisa ser um número inteiro.',
  })
  @IsNotEmpty({
    message: 'O produto é obrigatório.',
  })
  productId!: number;

  // Quantidade Solicitada
  @ApiProperty({
    example: 3,
    description: 'Quantidade do produto que deve ser comprada.',
    minimum: 1,
  })
  @IsInt({
    message: 'A quantidade solicitada precisa ser um número inteiro.',
  })
  @Min(1, {
    message: 'A quantidade solicitada precisa ser maior que zero.',
  })
  @IsNotEmpty({
    message: 'A quantidade requisitada é obrigatória.',
  })
  requestedQuantity!: number;

  // Notas
  @ApiPropertyOptional({
    example: 'Comprar preferencialmente a marca X.',
    description: 'Observação adicional sobre o item.',
  })
  @IsString({
    message: 'A observação precisa ser um texto.',
  })
  @IsOptional()
  notes?: string;
}
