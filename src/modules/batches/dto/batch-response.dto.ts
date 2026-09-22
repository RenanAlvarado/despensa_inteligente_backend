import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BatchStatus } from '../enums/batches-enums.enum';

export class BatchResponseDto {
  // ID do lote
  @ApiProperty({
    example: 1,
    description: 'ID do lote.',
  })
  id!: number;

  //   ID do produto
  @ApiProperty({
    example: 1,
    description: 'ID do produto associado ao lote.',
  })
  productId!: number;

  //   Data de validade
  @ApiProperty({
    example: '2026-12-31',
    description: 'Data de validade do lote.',
    format: 'date',
  })
  expirationDate!: Date;

  //   Data de compra
  @ApiProperty({
    example: '2026-09-21',
    description: 'Data de compra do lote.',
    format: 'date',
  })
  purchaseDate!: Date;

  //   Quantidade
  @ApiProperty({
    example: 5,
    description: 'Quantidade atual de produtos no lote.',
  })
  quantity!: number;

  //   Preço Unitário
  @ApiProperty({
    example: '12.50',
    description: 'Preço unitário do produto.',
  })
  unitPrice!: string;

  //   Notas
  @ApiPropertyOptional({
    example: 'Lote comprado em promoção.',
    description: 'Observações sobre o lote.',
    nullable: true,
  })
  notes!: string | null;

  //   Valor Total
  @ApiProperty({
    example: 62.5,
    description: 'Valor total atual do lote.',
  })
  totalValue!: number;

  //   Status
  @ApiProperty({
    example: BatchStatus.VALID,
    description: 'Status atual do lote em relação à data de validade.',
    enum: BatchStatus,
  })
  status!: BatchStatus;
}
