import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly brandsService: BrandsService,

    private readonly categoriesService: CategoriesService,
  ) {}

  // Criar Produto
  async create(createProductDto: CreateProductDto) {
    await this.validateRelations(
      createProductDto.brandId,
      createProductDto.categoryId,
    );

    const product = this.productRepository.create(createProductDto);

    return this.productRepository.save(product);
  }

  // Listar todos ou filtrar
  async findAll(name?: string): Promise<Product[]> {
    if (name) {
      return this.productRepository
        .createQueryBuilder('product')
        .where('product.name LIKE :name', {
          name: `%${name}%`,
        })
        .getMany();
    }

    return this.productRepository.find();
  }

  // Buscar Por ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  // Atualizar Categoria
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    await this.validateRelations(
      updateProductDto.brandId,
      updateProductDto.categoryId,
    );

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  // Validar se Marca e Categoria existem
  private async validateRelations(
    brandId?: number,
    categoryId?: number,
  ): Promise<void> {
    if (brandId !== undefined) {
      await this.brandsService.findOne(brandId);
    }

    if (categoryId !== undefined) {
      await this.categoriesService.findOne(categoryId);
    }
  }
}
