import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BatchMovementType } from '../enums/batch-movement.enums';
import { ToUpperCase } from '../../../common/decorators/uppercase.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindBatchMovementsQueryDto extends PaginationQueryDto {
  @IsEnum(BatchMovementType, {
    message:
      'O tipo de movimentação dos filtros é inválido. Permitidos: ENTRADA, CONSUMO, DESCARTE, AJUSTE',
  })
  @ToUpperCase()
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsOptional()
  type?: BatchMovementType;
}
