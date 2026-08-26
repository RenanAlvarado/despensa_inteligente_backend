// Imports
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { OpenFoodFactsService } from '../open-food-facts/open-food-facts.service';
import { ProductCreateType } from './enums/products.enum';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly openFoodFactsService: OpenFoodFactsService,
  ) {}

  // Criar Produto
  async create(
    type: ProductCreateType,
    body: CreateProductDto | CreateProductByBarcodeDto,
  ): Promise<Product> {
    if (type === ProductCreateType.BARCODE) {
      return this.createByBarcode(body as CreateProductByBarcodeDto);
    }

    return this.createManual(body as CreateProductDto);
  }
  // Cadastro Manual de Produtos
  private async createManual(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    await this.validateRelations(
      createProductDto.brandId,
      createProductDto.categoryId,
    );

    const product = this.productRepository.create(createProductDto);

    return this.productRepository.save(product);
  }

  private async createByBarcode(
    createProductDto: CreateProductByBarcodeDto,
  ): Promise<Product> {
    // Buscar produto na API externa
    const externalProduct =
      await this.openFoodFactsService.findProductByBarcode(
        createProductDto.barcode,
      );

    // Buscar ou criar marca
    const brand = await this.brandsService.findOrCreateByName(
      externalProduct.brand,
    );

    // Buscar ou criar categoria
    const category = await this.categoriesService.findOrCreateByName(
      externalProduct.category,
    );

    // Criar produto
    const product = this.productRepository.create({
      brandId: brand.id,
      categoryId: category.id,
      name: externalProduct.name,
      barcode: externalProduct.barcode,
      imageUrl: externalProduct.imageUrl,
      unitType: externalProduct.unit,
      unitQuantity: externalProduct.quantity,
    });

    console.log('Produto antes de salvar:', product);
    console.log('UnitType:', product.unitType);

    // Salvar produto
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
