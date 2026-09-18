// Imports
import {
  ConflictException,
  forwardRef,
  Inject,
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
import { Order } from '../../common/enums/order-filter.enum';
import { capitalizeFirstLetter } from '../../common/utils/string.util';
import { BatchesService } from '../batches/batches.service';
import { ShopListItemsService } from '../shop-list-items/shop-list-items.service';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

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
    private readonly batchesService: BatchesService,
    private readonly shopListItemsService: ShopListItemsService,
  ) {}

  // Cadastro Manual de Produtos
  async createManual(
    createProductManualDto: CreateProductManualDto,
  ): Promise<Product> {
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

    return this.productRepository.save(product);
  }

  // Cadastro via API
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
    return this.productRepository.save(product);
  }

  // Listar todos ou filtrar
  async findAll(query: FindProductsQueryDto) {
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

    queryBuilder.orderBy('product.name', order).skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    await this.productRepository.save(product);

    return await this.findOne(id);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    await this.findOne(id);

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
      await this.brandsService.findOne(brandId);
    }

    if (categoryId !== undefined && categoryId !== null) {
      await this.categoriesService.findOne(categoryId);
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
}
