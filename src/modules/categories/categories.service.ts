import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Categoria
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar duplicidade
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        'Já existe uma categoria cadastrada com este nome.',
      );
    }

    // Criação
    const category = this.categoryRepository.create(createCategoryDto);

    // Retorno
    return this.categoryRepository.save(category);
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
      name,
    });

    return this.categoryRepository.save(newCategory);
  }

  // Listar Todas as Marcas ou usar filtros
  async findAll(name?: string): Promise<Category[]> {
    if (name) {
      return this.categoryRepository
        .createQueryBuilder('category')
        .where('category.name LIKE :name', {
          name: `%${name}%`,
        })
        .getMany();
    }

    return this.categoryRepository.find();
  }

  // Buscar Por ID
  async findOne(id: number): Promise<Category> {
    const brand = await this.categoryRepository.findOneBy({
      id,
    });

    if (!brand) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return brand;
  }

  // Atualizar categoria
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name !== undefined) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
        },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          'Já existe uma categoria cadastrada com este nome.',
        );
      }
    }

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

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
}
