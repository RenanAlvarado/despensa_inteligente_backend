import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Order } from '../../common/enums/order-filter.enum';
import { ProductsService } from '../products/products.service';
import { BrandResponseDto } from './dto/brand-response.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FindBrandsQueryDto } from './dto/find-brands-query.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Marca
  async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    // Verificar duplicidade
    await this.checkNameDuplicate(createBrandDto.name);

    // Criação
    const brand = this.brandRepository.create(createBrandDto);

    // Retorno
    const savedBrand = await this.brandRepository.save(brand);

    return this.toResponse(savedBrand);
  }

  // Busca e criação Via Nome
  async findOrCreateByName(name: string): Promise<Brand> {
    // Tirar espaços em branco
    const normalizedName = name.trim();

    // Buscar
    const brand = await this.brandRepository.findOne({
      where: {
        name: normalizedName,
      },
    });

    if (brand) {
      return brand;
    }

    const newBrand = this.brandRepository.create({
      name: normalizedName,
    });

    return this.brandRepository.save(newBrand);
  }

  // Listar Todas as Marcas ou usar filtros
  async findAll(
    query: FindBrandsQueryDto,
  ): Promise<PaginatedResponseDto<BrandResponseDto>> {
    const { name, page = 1, limit = 10, order = Order.ASC } = query;

    const queryBuilder = this.brandRepository.createQueryBuilder('brand');

    if (name) {
      queryBuilder.andWhere('brand.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('brand.name', order)
      .addOrderBy('brand.id', order)
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((data) => this.toResponse(data)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Por ID
  async findOne(id: number): Promise<BrandResponseDto> {
    const brand = await this.findOneEntity(id);

    return this.toResponse(brand);
  }

  async findOneEntity(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({
      id,
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    return brand;
  }

  // Atualizar
  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    const brand = await this.findOneEntity(id);

    await this.checkNameDuplicate(updateBrandDto.name, id);

    Object.assign(brand, updateBrandDto);

    const savedBrand = await this.brandRepository.save(brand);

    return this.toResponse(savedBrand);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const brand = await this.findOneEntity(id);

    const productCount = await this.productsService.countByBrandId(id);

    if (productCount !== undefined) {
      throw new ConflictException({
        message:
          'Não é possível excluir a marca, pois existem produtos cadastrados com ela.',
        products: productCount,
      });
    }

    await this.brandRepository.remove(brand);
  }

  // Colocar no padrão de resposta
  private toResponse(brand: Brand): BrandResponseDto {
    return {
      id: brand.id,
      name: brand.name,
    };
  }

  // Verificar duplicidade
  private async checkNameDuplicate(name: string, id?: number): Promise<void> {
    const existingBrand = await this.brandRepository.findOne({
      where: {
        name,
      },
    });

    if (existingBrand && existingBrand.id !== id) {
      throw new ConflictException(
        'Já existe uma marca cadastrada com este nome.',
      );
    }
  }
}
