import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { BatchMovementType } from '../enums/batch-movement.enums';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';

export class CreateBatchMovementDto {
  @IsEnum(BatchMovementType, {
    message:
      'O tipo de movimentação é inválido. Permitidos: ENTRADA, CONSUMO, DESCARTE, AJUSTE',
  })
  @ToUpperCase()
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O tipo de movimentação é obrigatório.' })
  type!: BatchMovementType;

  @MinLength(3, {
    message: 'O motivo precisa ter pelo menos 3 caracteres.',
  })
  @IsString({ message: 'O motivo precisa ser um texto.' })
  @IsOptional()
  reason?: string;

  @IsInt({ message: 'A quantidade precisa ser um número inteiro.' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  quantity!: number;
}
