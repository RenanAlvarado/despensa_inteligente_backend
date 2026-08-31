import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

// Usado para validação do TS dos guards
interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
  };
}

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

  // Buscar Todos os Lotes do Usuário
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.batchesService.findAll(userId);
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

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchesService.update(+id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.batchesService.remove(+id);
  }
}
