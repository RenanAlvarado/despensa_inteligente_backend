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
import { capitalizeFirstLetter } from '../../common/utils/string.util';
import { BatchesService } from '../batches/batches.service';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { OpenFoodFactsService } from '../open-food-facts/open-food-facts.service';
import { ShopListItemsService } from '../shop-list-items/shop-list-items.service';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';
import { CreateProductManualDto } from './dto/create-product-manual.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductSource } from './enums/products.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @Inject(forwardRef(() => BrandsService))
    private readonly brandsService: BrandsService,

    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly openFoodFactsService: OpenFoodFactsService,

    @Inject(forwardRef(() => BatchesService))
    private readonly batchesService: BatchesService,

    private readonly shopListItemsService: ShopListItemsService,
  ) {}

  // Cadastro Manual de Produtos
  async createManual(
    createProductManualDto: CreateProductManualDto,
  ): Promise<ProductResponseDto> {
    // Se existir código de barras, ele vai tentar salvar pela open food facts
    const { barcode } = createProductManualDto;

    if (barcode) {
      await this.validateBarcode(barcode);

      const externalProduct =
        await this.openFoodFactsService.tryFindProductByBarcode(barcode);

      if (externalProduct) {
        throw new ConflictException({
          message:
            'Este código de barras pertence a um produto encontrado na API externa.',
          product: externalProduct,
        });
      }
    }

    // Verificar Categoria e Marca
    await this.validateRelations(
      createProductManualDto.brandId,
      createProductManualDto.categoryId,
    );

    const product = this.productRepository.create({
      brandId: createProductManualDto.brandId,
      categoryId: createProductManualDto.categoryId,
      name: capitalizeFirstLetter(createProductManualDto.name),
      barcode: createProductManualDto.barcode ?? null,
      imageUrl: createProductManualDto.imageUrl ?? null,
      unitType: createProductManualDto.unitType,
      unitQuantity: createProductManualDto.unitQuantity,
      source: ProductSource.MANUAL,
    });

    const savedProduct = await this.productRepository.save(product);

    return this.findOne(savedProduct.id);
  }

  // Cadastro via API
  async createByBarcode(
    createProductByBarcodeDto: CreateProductByBarcodeDto,
  ): Promise<ProductResponseDto> {
    // Validar repetição
    await this.validateBarcode(createProductByBarcodeDto.barcode);
    // Buscar produto na API externa
    const externalProduct =
      await this.openFoodFactsService.findProductByBarcode(
        createProductByBarcodeDto.barcode,
      );

    // Buscar ou criar marca e categoria se existirem
    const brand = externalProduct.brand
      ? await this.brandsService.findOrCreateByName(externalProduct.brand)
      : null;

    const category = externalProduct.category
      ? await this.categoriesService.findOrCreateByName(
          externalProduct.category,
        )
      : null;

    // Criar produto
    const product = this.productRepository.create({
      brandId: brand?.id ?? null,
      categoryId: category?.id ?? null,
      name: capitalizeFirstLetter(externalProduct.name),
      barcode: externalProduct.barcode,
      imageUrl: externalProduct.imageUrl,
      unitType: externalProduct.unit,
      unitQuantity: externalProduct.quantity,
      source: ProductSource.OPEN_FOOD_FACTS,
    });

    // Salvar produto
    const savedProduct = await this.productRepository.save(product);

    return this.findOne(savedProduct.id);
  }

  // Listar todos ou filtrar
  async findAll(
    query: FindProductsQueryDto,
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const {
      name,
      brandId,
      categoryId,
      page = 1,
      limit = 10,
      order = Order.ASC,
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category');

    if (name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (brandId !== undefined) {
      queryBuilder.andWhere('product.brandId = :brandId', {
        brandId,
      });
    }

    if (categoryId !== undefined) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('product.name', order)
      .addOrderBy('product.id', order)
      .skip(skip)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products.map((product) => this.toResponse(product)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Por ID
  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.findOneEntity(id);

    return this.toResponse(product);
  }

  async findOneEntity(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
        category: true,
      },
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
  ): Promise<ProductResponseDto> {
    const product = await this.findOneEntity(id);

    const updateData = { ...updateProductDto };

    if (product.source === ProductSource.OPEN_FOOD_FACTS) {
      if (product.name !== null) delete updateData.name;
      if (product.brandId !== null) delete updateData.brandId;
      if (product.categoryId !== null) delete updateData.categoryId;
      if (product.imageUrl !== null) delete updateData.imageUrl;
      if (product.unitType !== null) delete updateData.unitType;
      if (product.unitQuantity !== null) delete updateData.unitQuantity;
    }

    await this.validateRelations(updateData.brandId, updateData.categoryId);

    if (updateData.name !== undefined) {
      updateData.name = capitalizeFirstLetter(updateData.name);
    }

    Object.assign(product, updateData);

    const savedProduct = await this.productRepository.save(product);

    return this.findOne(savedProduct.id);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    await this.findOneEntity(id);

    const batchCount = await this.batchesService.countByProductId(id);

    const shopListItemCount =
      await this.shopListItemsService.countByProductId(id);

    if (batchCount !== null || shopListItemCount !== null) {
      throw new ConflictException({
        message:
          'Não é possível excluir o produto, pois ele possui registros relacionados.',
        batches: batchCount,
        shopListItems: shopListItemCount,
      });
    }

    await this.productRepository.delete(id);
  }

  // Validar se Marca e Categoria existem
  private async validateRelations(
    brandId?: number | null,
    categoryId?: number | null,
  ): Promise<void> {
    if (brandId !== undefined && brandId !== null) {
      await this.brandsService.findOneEntity(brandId);
    }

    if (categoryId !== undefined && categoryId !== null) {
      await this.categoriesService.findOneEntity(categoryId);
    }
  }

  // Verificar Código de Barras
  private async validateBarcode(barcode: string): Promise<void> {
    const product = await this.productRepository.findOneBy({
      barcode,
    });

    if (product) {
      throw new ConflictException(
        'Já existe um produto cadastrado com este código de barras.',
      );
    }
  }

  // Contar produtos por marca
  async countByBrandId(brandId: number): Promise<number | undefined> {
    const count = await this.productRepository.countBy({
      brandId,
    });

    return count > 0 ? count : undefined;
  }

  // Contar produtos por categoria
  async countByCategoryId(categoryId: number): Promise<number | undefined> {
    const count = await this.productRepository.countBy({
      categoryId,
    });

    return count > 0 ? count : undefined;
  }

  // Mudar para o padrão
  private toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      imageUrl: product.imageUrl,
      unitType: product.unitType,
      unitQuantity: product.unitQuantity,
      source: product.source,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
    };
  }
}
