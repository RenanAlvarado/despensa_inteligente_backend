import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { BatchMovementType } from '../enums/batch-movement.enums';

export class FindBatchMovementsQueryDto extends PaginationQueryDto {
  // Tipo
  @ApiPropertyOptional({
    enum: BatchMovementType,
    example: BatchMovementType.CONSUMPTION,
    description: 'Filtra as movimentações pelo tipo.',
  })
  @IsEnum(BatchMovementType, {
    message:
      'O tipo de movimentação dos filtros é inválido. Permitidos: ENTRADA, CONSUMO, DESCARTE, AJUSTE',
  })
  @ToUpperCase()
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsOptional()
  type?: BatchMovementType;
}
