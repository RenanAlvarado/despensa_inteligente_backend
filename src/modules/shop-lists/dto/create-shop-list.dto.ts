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
