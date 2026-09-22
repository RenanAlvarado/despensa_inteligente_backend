import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BatchesService } from './batches.service';
import { BatchResponseDto } from './dto/batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { FindBatchesQueryDto } from './dto/find-batches-query.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@ApiTags('Lotes')
@ApiBearerAuth()
@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  // Criar Lote
  @ApiOperation({
    summary: 'Cadastra um lote',
    description:
      'Cadastra um novo lote vinculado ao usuário autenticado e a um produto existente.',
  })
  @ApiCreatedResponse({
    description: 'Lote criado com sucesso.',
    type: BatchResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Produto ou usuário não encontrado.' })
  @ApiResponse({
    status: 400,
    description:
      'A data de compra não pode ser futura ou a data de validade não pode ser anterior à data de compra.',
  })
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createBatchDto: CreateBatchDto,
  ) {
    const userId = request.user.sub;

    return this.batchesService.create(userId, createBatchDto);
  }

  // Buscar Todos os Lotes do Usuário ou aplicar filtros
  @ApiOperation({
    summary: 'Lista os lotes',
    description:
      'Lista os lotes pertencentes ao usuário autenticado com suporte a paginação, filtro por produto e ordenação.',
  })
  @ApiPaginatedResponse(BatchResponseDto)
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindBatchesQueryDto,
  ) {
    return this.batchesService.findAll(req.user.sub, query);
  }

  // Buscar Lote por ID
  @ApiOperation({
    summary: 'Busca um lote por ID',
    description:
      'Retorna um lote específico pertencente ao usuário autenticado, incluindo seu valor total e status de validade.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID do lote.' })
  @ApiOkResponse({
    description: 'Lote encontrado com sucesso.',
    type: BatchResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lote não encontrado.' })
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: number,
  ) {
    const userId = request.user.sub;
    return this.batchesService.findOne(id, userId);
  }

  // Atualizar Lote
  @ApiOperation({
    summary: 'Atualiza um lote',
    description:
      'Atualiza os dados de um lote existente. A data de compra não pode ser futura e a data de validade não pode ser anterior à data de compra.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID do lote.' })
  @ApiOkResponse({
    description: 'Lote atualizado com sucesso.',
    type: BatchResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Lote não encontrado.' })
  @ApiBadRequestResponse({
    description:
      'A data de compra não pode ser futura ou a data de validade não pode ser anterior à data de compra.',
  })
  @Put(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    const userId = request.user.sub;

    return this.batchesService.update(id, userId, updateBatchDto);
  }

  // Excluir Lote
  @ApiOperation({
    summary: 'Exclui um lote',
    description: 'Exclui um lote pertencente ao usuário autenticado.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID do lote.' })
  @ApiNoContentResponse({ description: 'Lote excluído com sucesso.' })
  @ApiNotFoundResponse({ description: 'Lote não encontrado.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: number,
  ) {
    const userId = request.user.sub;

    return this.batchesService.remove(id, userId);
  }
}
