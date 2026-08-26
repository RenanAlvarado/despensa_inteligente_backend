import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Criar Categoria
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
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

  // Atualizar Categoria
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);
  }
}
