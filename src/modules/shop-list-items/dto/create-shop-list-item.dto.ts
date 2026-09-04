import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateShopListItemDto {
  @IsInt({
    message: 'O ID do produto precisa ser um número inteiro.',
  })
  @IsNotEmpty({
    message: 'O produto é obrigatório.',
  })
  productId!: number;

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

  @IsString({
    message: 'A observação precisa ser um texto.',
  })
  @IsOptional()
  notes?: string;
}
