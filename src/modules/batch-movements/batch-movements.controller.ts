import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BatchMovementsService } from './batch-movements.service';
import { BatchMovementResponseDto } from './dto/batch-movement-response.dto';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { FindBatchMovementsQueryDto } from './dto/find-batches-movements-query.dto';

@ApiTags('Movimentações de Lotes')
@ApiBearerAuth()
@Controller('batches/:batchId/movements')
@UseGuards(JwtAuthGuard)
export class BatchMovementsController {
  constructor(private readonly batchMovementsService: BatchMovementsService) {}

  // Criar movimentação
  @ApiOperation({
    summary: 'Registra uma movimentação no lote',
    description:
      'Registra uma movimentação de entrada, consumo, descarte ou ajuste e atualiza a quantidade do lote de forma transacional.',
  })
  @ApiParam({
    name: 'batchId',
    example: 1,
    description: 'ID do lote que receberá a movimentação.',
  })
  @ApiCreatedResponse({
    description: 'Movimentação registrada com sucesso.',
    type: BatchMovementResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lote não encontrado.' })
  @ApiBadRequestResponse({
    description:
      'Quantidade inválida para o tipo de movimentação ou ajuste com quantidade zero.',
  })
  @Post()
  create(
    @Param('batchId', ParseIdPipe) batchId: number,
    @Req() request: AuthenticatedRequest,
    @Body() createBatchMovementDto: CreateBatchMovementDto,
  ) {
    const userId = request.user.sub;

    return this.batchMovementsService.create(
      userId,
      batchId,
      createBatchMovementDto,
    );
  }

  // Listar todas ou filtrar
  @ApiOperation({
    summary: 'Lista as movimentações de um lote',
    description:
      'Lista as movimentações de um lote pertencente ao usuário autenticado, com paginação, ordenação e filtro por tipo.',
  })
  @ApiParam({ name: 'batchId', example: 1, description: 'ID do lote.' })
  @ApiPaginatedResponse(BatchMovementResponseDto)
  @ApiNotFoundResponse({ description: 'Lote não encontrado.' })
  @Get()
  findAll(
    @Param('batchId', ParseIdPipe) batchId: number,
    @Req() request: AuthenticatedRequest,
    @Query() query: FindBatchMovementsQueryDto,
  ) {
    const userId = request.user.sub;

    return this.batchMovementsService.findAll(userId, batchId, query);
  }

  // Listar por ID
  @ApiOperation({
    summary: 'Busca uma movimentação por ID',
    description:
      'Retorna uma movimentação específica pertencente ao lote informado.',
  })
  @ApiParam({ name: 'batchId', example: 1, description: 'ID do lote.' })
  @ApiParam({ name: 'id', example: 1, description: 'ID da movimentação.' })
  @ApiOkResponse({
    description: 'Movimentação encontrada com sucesso.',
    type: BatchMovementResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lote ou movimentação não encontrado.' })
  @Get(':id')
  findOne(
    @Param('batchId', ParseIdPipe) batchId: number,
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.batchMovementsService.findOne(userId, batchId, id);
  }
}
