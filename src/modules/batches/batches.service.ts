import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { FindBatchesQueryDto } from './dto/find-batches-query.dto';
import { Order } from '../../common/enums/order-filter.enum';
import { BatchSortBy, BatchStatus } from './enums/batches-enums.enum';

// Retorno de dados
type BatchWithTotalValue = Batch & {
  totalValue: number;
  status: BatchStatus;
};

const sortColumnMap = {
  [BatchSortBy.PURCHASE_DATE]: 'batch.purchaseDate',
  [BatchSortBy.EXPIRATION_DATE]: 'batch.expirationDate',
  [BatchSortBy.QUANTITY]: 'batch.quantity',
  [BatchSortBy.UNIT_PRICE]: 'batch.unitPrice',
};

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,

    private readonly usersService: UsersService,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Lote
  async create(userId: number, createBatchDto: CreateBatchDto): Promise<Batch> {
    // Validar usuário
    await this.usersService.findOne(userId);

    // Validar produto
    await this.productsService.findOne(createBatchDto.productId);

    // Validar Datas
    const expirationDate = new Date(createBatchDto.expirationDate);
    const purchaseDate = new Date(createBatchDto.purchaseDate);

    this.validateDates(expirationDate, purchaseDate);

    const batch = this.batchRepository.create({
      userId,
      productId: createBatchDto.productId,
      expirationDate,
      purchaseDate,
      quantity: createBatchDto.quantity,
      unitPrice: createBatchDto.unitPrice,
      notes: createBatchDto.notes ?? null,
    });

    return this.batchRepository.save(batch);
  }

  // Buscar todos os lotes ou aplicar filtros
  async findAll(userId: number, query: FindBatchesQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = BatchSortBy.PURCHASE_DATE,
      order = Order.ASC,
      productId,
    } = query;

    const queryBuilder = this.batchRepository
      .createQueryBuilder('batch')
      .where('batch.userId = :userId', {
        userId,
      });

    if (productId !== undefined) {
      queryBuilder.andWhere('batch.productId = :productId', {
        productId,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy(sortColumnMap[sortBy], order)
      .addOrderBy('batch.id', order) //Desempate por ID
      .skip(skip)
      .take(limit);

    const [batches, total] = await queryBuilder.getManyAndCount();

    const data = batches.map((batch) => ({
      ...batch,
      totalValue: this.calculateTotalValue(batch),
      status: this.calculateStatus(batch.expirationDate),
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Lote pelo ID (Deve ser do usuário)
  async findOne(id: number, userId: number): Promise<BatchWithTotalValue> {
    const batch = await this.batchRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    return {
      ...batch,
      totalValue: this.calculateTotalValue(batch),
      status: this.calculateStatus(batch.expirationDate),
    };
  }

  // Atualizar Lote
  async update(
    id: number,
    userId: number,
    updateBatchDto: UpdateBatchDto,
  ): Promise<Batch> {
    // Validar Lote
    const batch = await this.findOne(id, userId);

    const expirationDate =
      updateBatchDto.expirationDate !== undefined
        ? new Date(updateBatchDto.expirationDate)
        : batch.expirationDate;

    const purchaseDate =
      updateBatchDto.purchaseDate !== undefined
        ? new Date(updateBatchDto.purchaseDate)
        : batch.purchaseDate;

    this.validateDates(expirationDate, purchaseDate);

    Object.assign(batch, {
      ...updateBatchDto,
      expirationDate,
      purchaseDate,
    });

    return this.batchRepository.save(batch);
  }

  // Mudar quantidade
  async alterQuantity(
    manager: EntityManager,
    batch: Batch,
    quantity: number,
  ): Promise<Batch> {
    const newQuantity = batch.quantity + quantity;

    if (newQuantity < 0) {
      throw new BadRequestException({
        message: 'A quantidade do lote não pode ser negativa.',
        currentQuantity: batch.quantity,
      });
    }

    batch.quantity = newQuantity;

    return manager.save(Batch, batch);
  }

  // Excluir Lote
  async remove(id: number, userId: number): Promise<void> {
    const batch = await this.findOne(id, userId);

    await this.batchRepository.remove(batch);
  }

  // Valor total dos produtos
  private calculateTotalValue(batch: Batch): number {
    return batch.quantity * Number(batch.unitPrice);
  }

  // Contar itens de lista de compras por produto
  async countByProductId(productId: number): Promise<number | null> {
    const count = await this.batchRepository.countBy({
      productId,
    });

    return count > 0 ? count : null;
  }

  // Validação de Datas
  private validateDates(expirationDate: Date, purchaseDate: Date): void {
    if (purchaseDate > new Date()) {
      throw new BadRequestException('A data de compra não pode ser futura.');
    }

    if (expirationDate < purchaseDate) {
      throw new BadRequestException(
        'A data de validade não pode ser anterior à data de compra.',
      );
    }
  }

  // Retorno de Status para o Front end
  private calculateStatus(expirationDate: Date): BatchStatus {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiration = new Date(expirationDate);
    expiration.setHours(0, 0, 0, 0);

    if (expiration < today) {
      return BatchStatus.EXPIRED;
    }

    if (expiration.getTime() === today.getTime()) {
      return BatchStatus.EXPIRES_TODAY;
    }

    return BatchStatus.VALID;
  }
}
