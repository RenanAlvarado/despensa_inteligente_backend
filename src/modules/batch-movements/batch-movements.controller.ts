import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BatchMovementsService } from './batch-movements.service';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { FindBatchMovementsDto } from './dto/find-batch-movements.dto';

@Controller('batches/:batchId/movements')
@UseGuards(JwtAuthGuard)
export class BatchMovementsController {
  constructor(private readonly batchMovementsService: BatchMovementsService) {}

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

  @Get()
  findAll(
    @Param('batchId', ParseIdPipe) batchId: number,
    @Req() request: AuthenticatedRequest,
    @Query() query: FindBatchMovementsDto,
  ) {
    const userId = request.user.sub;

    return this.batchMovementsService.findAll(userId, batchId, query);
  }

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
