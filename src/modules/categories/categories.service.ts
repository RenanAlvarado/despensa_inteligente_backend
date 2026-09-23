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
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Categoria
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Verificar duplicidade
    await this.checkNameDuplicate(createCategoryDto.name);

    // Criação
    const category = this.categoryRepository.create(createCategoryDto);

    // Retorno
    const savedCategory = await this.categoryRepository.save(category);

    return this.toResponse(savedCategory);
  }

  // Busca e criação Via Nome
  async findOrCreateByName(name: string): Promise<Category> {
    // Tirar espaços em branco
    const normalizedName = name.trim();

    // Buscar
    const category = await this.categoryRepository.findOne({
      where: {
        name: normalizedName,
      },
    });

    if (category) {
      return category;
    }

    const newCategory = this.categoryRepository.create({
      name: normalizedName,
    });

    return this.categoryRepository.save(newCategory);
  }

  // Listar Todas as Marcas ou usar filtros
  async findAll(
    query: FindCategoriesQueryDto,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const { name, page = 1, limit = 10, order = Order.ASC } = query;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (name) {
      queryBuilder.andWhere('category.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('category.name', order)
      .addOrderBy('category.id', order)
      .skip(skip)
      .take(limit);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories.map((category) => this.toResponse(category)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Por ID
  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.findOneEntity(id);

    return this.toResponse(category);
  }

  async findOneEntity(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      id,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  // Atualizar categoria
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.findOneEntity(id);

    await this.checkNameDuplicate(updateCategoryDto.name, id);

    Object.assign(category, updateCategoryDto);

    const savedCategory = await this.categoryRepository.save(category);

    return this.toResponse(savedCategory);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const category = await this.findOneEntity(id);

    const productCount = await this.productsService.countByCategoryId(id);

    if (productCount !== undefined) {
      throw new ConflictException({
        message:
          'Não é possível excluir a categoria, pois existem produtos cadastrados com ela.',
        products: productCount,
      });
    }

    await this.categoryRepository.remove(category);
  }

  // Padronização de Resposta
  private toResponse(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
    };
  }

  // Verificar duplicidade de nome
  private async checkNameDuplicate(name: string, id?: number): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictException(
        'Já existe uma categoria cadastrada com este nome.',
      );
    }
  }
}
