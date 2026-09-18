import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { FindBatchesQueryDto } from './dto/find-batches-query.dto';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  // Criar Lote
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createBatchDto: CreateBatchDto,
  ) {
    const userId = request.user.sub;

    return this.batchesService.create(userId, createBatchDto);
  }

  // Buscar Todos os Lotes do Usuário ou aplicar filtros
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindBatchesQueryDto,
  ) {
    return this.batchesService.findAll(req.user.sub, query);
  }

  // Buscar Lote por ID
  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: number,
  ) {
    const userId = request.user.sub;
    return this.batchesService.findOne(+id, userId);
  }

  // Atualizar Produto
  @Put(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIdPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    const userId = request.user.sub;

    return this.batchesService.update(id, userId, updateBatchDto);
  }

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
