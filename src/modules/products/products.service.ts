// Imports
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductManualDto } from './dto/create-product-manual.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { OpenFoodFactsService } from '../open-food-facts/open-food-facts.service';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';
import { ProductSource } from './enums/products.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly openFoodFactsService: OpenFoodFactsService,
  ) {}

  // Cadastro Manual de Produtos
  async createManual(
    createProductManualDto: CreateProductManualDto,
  ): Promise<Product> {
    await this.validateRelations(
      createProductManualDto.brandId,
      createProductManualDto.categoryId,
    );

    if (createProductManualDto.barcode) {
      await this.validateBarcode(createProductManualDto.barcode);
    }

    const product = this.productRepository.create({
      brandId: createProductManualDto.brandId,
      categoryId: createProductManualDto.categoryId,
      name: createProductManualDto.name,
      barcode: createProductManualDto.barcode ?? null,
      imageUrl: createProductManualDto.imageUrl ?? null,
      unitType: createProductManualDto.unitType,
      unitQuantity: createProductManualDto.unitQuantity,
      source: ProductSource.MANUAL,
    });

    return this.productRepository.save(product);
  }

  async createByBarcode(
    createProductByBarcodeDto: CreateProductByBarcodeDto,
  ): Promise<Product> {
    // Validar repetição
    await this.validateBarcode(createProductByBarcodeDto.barcode);
    // Buscar produto na API externa
    const externalProduct =
      await this.openFoodFactsService.findProductByBarcode(
        createProductByBarcodeDto.barcode,
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
      source: ProductSource.OPEN_FOOD_FACTS,
    });

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

  // Atualizar Produto
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (product.source === ProductSource.OPEN_FOOD_FACTS) {
      return this.updateExternalProduct(product, updateProductDto);
    }

    return this.updateManualProduct(product, updateProductDto);
  }

  private async updateExternalProduct(
    product: Product,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const allowedFields = ['imageUrl'];

    const receivedFields = Object.keys(updateProductDto);

    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        'Produtos provenientes da API externa só podem ter a imagem alterada.',
      );
    }

    if (updateProductDto.imageUrl !== undefined) {
      product.imageUrl = updateProductDto.imageUrl;
    }

    return this.productRepository.save(product);
  }

  private async updateManualProduct(
    product: Product,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (updateProductDto.barcode !== undefined) {
      throw new BadRequestException(
        'O código de barras não pode ser alterado.',
      );
    }

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

  // Verificar Código de Barras
  private async validateBarcode(barcode: string): Promise<void> {
    if (!/^\d{13}$/.test(barcode)) {
      throw new BadRequestException(
        'O código de barras deve conter exatamente 13 dígitos.',
      );
    }

    const product = await this.productRepository.findOneBy({
      barcode,
    });

    if (product) {
      throw new ConflictException(
        'Já existe um produto cadastrado com este código de barras.',
      );
    }
  }
}
