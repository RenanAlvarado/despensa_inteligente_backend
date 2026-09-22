import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateShopListDto {
  // Nome
  @ApiProperty({
    example: 'Compras da semana',
    description: 'Nome da lista de compras.',
    minLength: 3,
  })
  @MinLength(3, {
    message: 'O nome precisa ter pelo menos 3 caracteres.',
  })
  @Trim()
  @IsString({
    message: 'O nome precisa ser um texto.',
  })
  @IsNotEmpty({
    message: 'O nome é obrigatório.',
  })
  name!: string;

  // Limite de Orçamento
  @ApiPropertyOptional({
    example: 250.5,
    description: 'Limite máximo de orçamento da lista de compras.',
    minimum: 0,
    nullable: true,
  })
  @Min(0, {
    message: 'O limite de orçamento não pode ser negativo.',
  })
  @IsNumber(
    {},
    {
      message: 'O limite de orçamento precisa ser um número.',
    },
  )
  @IsOptional()
  budgetLimit?: number;
}
