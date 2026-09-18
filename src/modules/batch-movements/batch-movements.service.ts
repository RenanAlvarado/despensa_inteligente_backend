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
import { FindBatchMovementsQueryDto } from './dto/find-batches-movements-query.dto';
import { Order } from '../../common/enums/order-filter.enum';

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
    query: FindBatchMovementsQueryDto,
  ) {
    await this.batchesService.findOne(batchId, userId);

    const { page = 1, limit = 10, type, order = Order.DESC } = query;

    const queryBuilder = this.batchMovementRepository
      .createQueryBuilder('movement')
      .where('movement.batchId = :batchId', {
        batchId,
      });

    if (type !== undefined) {
      queryBuilder.andWhere('movement.type = :type', {
        type,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('movement.createdAt', order)
      .addOrderBy('movement.id', order)
      .skip(skip)
      .take(limit);

    const [movements, total] = await queryBuilder.getManyAndCount();

    return {
      data: movements,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
