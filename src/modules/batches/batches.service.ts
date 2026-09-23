import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Order } from '../../common/enums/order-filter.enum';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { BatchResponseDto } from './dto/batch-response.dto';
import { CreateBatchDto } from './dto/create-batch.dto';
import { FindBatchesQueryDto } from './dto/find-batches-query.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';
import { BatchSortBy, BatchStatus } from './enums/batches-enums.enum';

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
  async create(
    userId: number,
    createBatchDto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
    // Validar usuário
    await this.usersService.findOneEntity(userId);

    // Validar produto
    await this.productsService.findOneEntity(createBatchDto.productId);

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

    const savedBatch = await this.batchRepository.save(batch);

    return this.toResponse(savedBatch);
  }

  // Buscar todos os lotes ou aplicar filtros
  async findAll(
    userId: number,
    query: FindBatchesQueryDto,
  ): Promise<PaginatedResponseDto<BatchResponseDto>> {
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

    return {
      data: batches.map((batch) => this.toResponse(batch)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Lote pelo ID (Deve ser do usuário)
  async findOne(id: number, userId: number): Promise<BatchResponseDto> {
    const batch = await this.findOneEntity(id, userId);

    return this.toResponse(batch);
  }

  async findOneEntity(id: number, userId: number): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    return batch;
  }

  // Atualizar Lote
  async update(
    id: number,
    userId: number,
    updateBatchDto: UpdateBatchDto,
  ): Promise<BatchResponseDto> {
    // Validar Lote
    const batch = await this.findOneEntity(id, userId);

    // Validação de Datas
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

    const savedBatch = await this.batchRepository.save(batch);

    return this.toResponse(savedBatch);
  }

  // Excluir Lote
  async remove(id: number, userId: number): Promise<void> {
    const batch = await this.findOneEntity(id, userId);

    await this.batchRepository.remove(batch);
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

  // Formatar para a resposta
  private toResponse(batch: Batch): BatchResponseDto {
    return {
      id: batch.id,
      productId: batch.productId,
      expirationDate: batch.expirationDate,
      purchaseDate: batch.purchaseDate,
      quantity: batch.quantity,
      unitPrice: batch.unitPrice,
      notes: batch.notes,
      totalValue: this.calculateTotalValue(batch),
      status: this.calculateStatus(batch.expirationDate),
    };
  }
}
