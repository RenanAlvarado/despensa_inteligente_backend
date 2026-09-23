import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BatchMovementType } from '../enums/batch-movement.enums';

export class BatchMovementResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID da movimentação.',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'ID do lote ao qual a movimentação pertence.',
  })
  batchId!: number;

  @ApiProperty({
    enum: BatchMovementType,
    example: BatchMovementType.CONSUMPTION,
    description:
      'Tipo da movimentação. ENTRADA aumenta o estoque; CONSUMO e DESCARTE diminuem; AJUSTE pode aumentar ou diminuir.',
  })
  type!: BatchMovementType;

  @ApiPropertyOptional({
    example: 'Consumo para preparo de refeição.',
    description: 'Motivo ou observação da movimentação.',
  })
  reason!: string | null;

  @ApiProperty({
    example: 2,
    description: 'Quantidade movimentada.',
  })
  quantity!: number;
}
