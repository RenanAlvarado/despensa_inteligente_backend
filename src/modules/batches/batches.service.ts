import {
  BadRequestException,
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

// Retorno de dados
type BatchWithTotalValue = Batch & {
  totalValue: number;
};

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  // Criar Lote
  async create(userId: number, createBatchDto: CreateBatchDto): Promise<Batch> {
    // Validar usuário
    await this.usersService.findOne(userId);

    // Validar produto
    await this.productsService.findOne(createBatchDto.productId);

    const batch = this.batchRepository.create({
      userId,
      productId: createBatchDto.productId,
      expirationDate: new Date(createBatchDto.expirationDate),
      purchaseDate: new Date(createBatchDto.purchaseDate),
      quantity: createBatchDto.quantity,
      unitPrice: createBatchDto.unitPrice,
      notes: createBatchDto.notes ?? null,
    });

    return this.batchRepository.save(batch);
  }

  // Buscar todos
  async findAll(userId: number): Promise<BatchWithTotalValue[]> {
    const batches = await this.batchRepository.find({
      where: {
        userId,
      },
    });

    return batches.map((batch) => ({
      ...batch,
      totalValue: this.calculateTotalValue(batch),
    }));
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
    };
  }

  // Atualizar Lote
  async update(
    id: number,
    userId: number,
    updateBatchDto: UpdateBatchDto,
  ): Promise<Batch> {
    const batch = await this.findOne(id, userId);

    Object.assign(batch, {
      ...updateBatchDto,
      expirationDate:
        updateBatchDto.expirationDate !== undefined
          ? new Date(updateBatchDto.expirationDate)
          : batch.expirationDate,
      purchaseDate:
        updateBatchDto.purchaseDate !== undefined
          ? new Date(updateBatchDto.purchaseDate)
          : batch.purchaseDate,
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
      throw new BadRequestException(
        'A quantidade do lote não pode ser negativa.',
      );
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
}
