import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

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
  async findAll(userId: number): Promise<Batch[]> {
    return this.batchRepository.find({
      where: {
        userId,
      },
    });
  }

  // Buscar Lote pelo ID (Deve ser do usuário)
  async findOne(id: number, userId: number): Promise<Batch> {
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

  update(id: number, updateBatchDto: UpdateBatchDto) {
    return `This action updates a #${id} batch`;
  }

  remove(id: number) {
    return `This action removes a #${id} batch`;
  }
}
