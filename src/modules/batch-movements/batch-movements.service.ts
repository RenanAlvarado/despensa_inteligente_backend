import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBatchMovementDto } from './dto/create-batch-movement.dto';
import { BatchMovement } from './entities/batch-movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { BatchMovementConfig } from './enums/batch-movement.enums';
import { FindBatchMovementsDto } from './dto/find-batch-movements.dto';

@Injectable()
export class BatchMovementsService {
  constructor(
    @InjectRepository(BatchMovement)
    private readonly batchMovementRepository: Repository<BatchMovement>,

    private readonly dataSource: DataSource,

    private readonly batchesService: BatchesService,
  ) {}

  // Criar Movimentação de lote
  async create(
    userId: number,
    batchId: number,
    createBatchMovementDto: CreateBatchMovementDto,
  ): Promise<BatchMovement> {
    // Verificar Existência do Batch e usuário
    const batch = await this.batchesService.findOne(batchId, userId);

    const config = BatchMovementConfig[createBatchMovementDto.type];

    if (config.increase !== null && createBatchMovementDto.quantity <= 0) {
      throw new BadRequestException(
        'A quantidade deve ser maior que zero para este tipo de movimentação.',
      );
    }

    if (config.increase === null && createBatchMovementDto.quantity === 0) {
      throw new BadRequestException(
        'A quantidade do ajuste não pode ser zero.',
      );
    }

    let quantity = createBatchMovementDto.quantity;

    if (config.increase === true) {
      quantity = Math.abs(quantity);
    }

    if (config.increase === false) {
      quantity = -Math.abs(quantity);
    }

    // Transaction para ter operação completa
    return this.dataSource.transaction(async (manager) => {
      await this.batchesService.alterQuantity(manager, batch, quantity);

      const movement = manager.create(BatchMovement, {
        batchId: batch.id,
        type: createBatchMovementDto.type,
        reason: createBatchMovementDto.reason ?? null,
        quantity: createBatchMovementDto.quantity,
      });

      return manager.save(BatchMovement, movement);
    });
  }

  // Buscar Todas as movimentações do lote
  async findAll(
    userId: number,
    batchId: number,
    query: FindBatchMovementsDto,
  ): Promise<BatchMovement[]> {
    await this.batchesService.findOne(batchId, userId);

    return this.batchMovementRepository.find({
      where: {
        batchId,
        ...(query.type && {
          type: query.type,
        }),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Buscar Movimentação
  async findOne(
    userId: number,
    batchId: number,
    id: number,
  ): Promise<BatchMovement> {
    await this.batchesService.findOne(batchId, userId);

    const movement = await this.batchMovementRepository.findOne({
      where: {
        id,
        batchId,
      },
    });

    if (!movement) {
      throw new NotFoundException('Movimentação não encontrada.');
    }

    return movement;
  }
}
