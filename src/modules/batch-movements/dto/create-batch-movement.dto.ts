import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { BatchMovementType } from '../enums/batch-movement.enums';

export class CreateBatchMovementDto {
  // Tipo de Movimentação
  @ApiProperty({
    enum: BatchMovementType,
    enumName: 'BatchMovementType',
    example: BatchMovementType.CONSUMPTION,
    description: `
Tipo da movimentação a ser registrada.

Opções disponíveis:
- ENTRADA: adiciona unidades ao estoque.
- CONSUMO: remove unidades por consumo.
- DESCARTE: remove unidades por descarte.
- AJUSTE: corrige a quantidade registrada no lote.

Para ENTRADA, CONSUMO e DESCARTE, informe uma quantidade positiva.
Para AJUSTE, informe uma quantidade positiva para aumentar o estoque
ou negativa para reduzi-lo.
  `,
  })
  @IsEnum(BatchMovementType, {
    message:
      'O tipo de movimentação é inválido. Permitidos: ENTRADA, CONSUMO, DESCARTE, AJUSTE',
  })
  @ToUpperCase()
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O tipo de movimentação é obrigatório.' })
  type!: BatchMovementType;

  // Motivo
  @ApiPropertyOptional({
    example: 'Consumo para preparo de refeição.',
    description: 'Motivo ou observação da movimentação.',
    minLength: 3,
  })
  @MinLength(3, {
    message: 'O motivo precisa ter pelo menos 3 caracteres.',
  })
  @IsString({ message: 'O motivo precisa ser um texto.' })
  @IsOptional()
  reason?: string;

  // Quantidade
  @ApiProperty({
    example: 2,
    description:
      'Quantidade movimentada. Para AJUSTE, valores positivos aumentam e valores negativos reduzem o lote.',
  })
  @IsInt({ message: 'A quantidade precisa ser um número inteiro.' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  quantity!: number;
}
