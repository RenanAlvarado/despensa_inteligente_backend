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
import { ShopListsService } from '../shop-lists/shop-lists.service';
import { CreateShopListItemDto } from './dto/create-shop-list-item.dto';
import { FindShopListItemsQueryDto } from './dto/find-shop-list-items-query.dto';
import { ShopListItemResponseDto } from './dto/shop-list-item-response.dto';
import { UpdateShopListItemDto } from './dto/update-shop-list-item.dto';
import { ShopListItem } from './entities/shop-list-item.entity';
import { ShoppingListItemStatus } from './enums/shop-list-item.enum';

@Injectable()
export class ShopListItemsService {
  constructor(
    @InjectRepository(ShopListItem)
    private readonly shopListItemRepository: Repository<ShopListItem>,

    private readonly shopListsService: ShopListsService,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Item da lista de compras
  async create(
    shopListId: number,
    userId: number,
    createShopListItemDto: CreateShopListItemDto,
  ): Promise<ShopListItemResponseDto> {
    // Validação
    await this.shopListsService.findOneEntity(shopListId, userId);

    await this.productsService.findOneEntity(createShopListItemDto.productId);

    await this.validateProductNotExists(
      shopListId,
      createShopListItemDto.productId,
    );

    const shopListItem = this.shopListItemRepository.create({
      shoppingListId: shopListId,
      productId: createShopListItemDto.productId,
      requestedQuantity: createShopListItemDto.requestedQuantity,
      purchasedQuantity: 0,
      status: ShoppingListItemStatus.PENDING,
      notes: createShopListItemDto.notes ?? null,
      unitPrice: null,
    });

    const savedItem = await this.shopListItemRepository.save(shopListItem);

    return this.toResponse(savedItem);
  }

  // Buscar todos os itens da lista
  async findAll(
    shopListId: number,
    userId: number,
    query: FindShopListItemsQueryDto,
  ): Promise<PaginatedResponseDto<ShopListItemResponseDto>> {
    await this.shopListsService.findOneEntity(shopListId, userId);

    const {
      page = 1,
      limit = 10,
      order = Order.DESC,
      productName,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.shopListItemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.product', 'product')
      .where('item.shoppingListId = :shopListId', {
        shopListId,
      });

    if (productName !== undefined) {
      queryBuilder.andWhere('product.name LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('item.status = :status', {
        status,
      });
    }

    queryBuilder
      .orderBy('item.createdAt', order)
      .addOrderBy('item.id', order)
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items.map((item) => this.toResponse(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Por ID
  async findOne(
    id: number,
    shopListId: number,
    userId: number,
  ): Promise<ShopListItemResponseDto> {
    await this.shopListsService.findOneEntity(shopListId, userId);

    const shopListItem = await this.findOneEntity(id, shopListId, userId);

    return this.toResponse(shopListItem);
  }

  async findOneEntity(
    id: number,
    shopListId: number,
    userId: number,
  ): Promise<ShopListItem> {
    // Validar Lista
    await this.shopListsService.findOneEntity(shopListId, userId);

    const shopListItem = await this.shopListItemRepository.findOne({
      where: {
        id,
        shoppingListId: shopListId,
      },
    });

    if (!shopListItem) {
      throw new NotFoundException('Item da lista de compras não encontrado.');
    }

    return shopListItem;
  }

  // Atualizar Item
  async update(
    id: number,
    shopListId: number,
    userId: number,
    updateShopListItemDto: UpdateShopListItemDto,
  ): Promise<ShopListItemResponseDto> {
    const shopListItem = await this.findOneEntity(id, shopListId, userId);

    const {
      productId,
      requestedQuantity,
      purchasedQuantity,
      notes,
      unitPrice,
    } = updateShopListItemDto;

    if (productId !== undefined && productId !== shopListItem.productId) {
      await this.productsService.findOneEntity(productId);

      await this.validateProductNotExists(shopListId, productId);

      shopListItem.productId = productId;
    }

    if (requestedQuantity !== undefined) {
      shopListItem.requestedQuantity = requestedQuantity;
    }

    if (purchasedQuantity !== undefined) {
      shopListItem.purchasedQuantity = purchasedQuantity;
    }

    if (notes !== undefined) {
      shopListItem.notes = notes;
    }

    if (unitPrice !== undefined) {
      shopListItem.unitPrice = unitPrice !== null ? unitPrice.toFixed(2) : null;
    }

    shopListItem.status = this.calculateStatus(
      shopListItem.requestedQuantity,
      shopListItem.purchasedQuantity,
    );

    const savedItem = await this.shopListItemRepository.save(shopListItem);

    return this.toResponse(savedItem);
  }

  // Excluir item
  async remove(id: number, shopListId: number, userId: number): Promise<void> {
    const shopListItem = await this.findOneEntity(id, shopListId, userId);

    await this.shopListItemRepository.remove(shopListItem);
  }

  // Verificar repetição de produto
  private async validateProductNotExists(
    shopListId: number,
    productId: number,
  ): Promise<void> {
    const existingItem = await this.shopListItemRepository.findOne({
      where: {
        shoppingListId: shopListId,
        productId,
      },
    });

    if (existingItem) {
      throw new ConflictException(
        'Este produto já está presente na lista de compras.',
      );
    }
  }

  // Mudança de Status
  private calculateStatus(
    requestedQuantity: number,
    purchasedQuantity: number,
  ): ShoppingListItemStatus {
    if (purchasedQuantity === 0) {
      return ShoppingListItemStatus.PENDING;
    }

    if (purchasedQuantity < requestedQuantity) {
      return ShoppingListItemStatus.PARTIAL;
    }

    return ShoppingListItemStatus.COMPLETED;
  }

  // Contar itens de lista de compras por produto
  async countByProductId(productId: number): Promise<number | null> {
    const count = await this.shopListItemRepository.countBy({
      productId,
    });

    return count > 0 ? count : null;
  }

  // Formatar resposta
  private toResponse(item: ShopListItem): ShopListItemResponseDto {
    const unitPrice = item.unitPrice !== null ? Number(item.unitPrice) : null;

    return {
      id: item.id,
      shoppingListId: item.shoppingListId,
      productId: item.productId,
      requestedQuantity: item.requestedQuantity,
      purchasedQuantity: item.purchasedQuantity,
      status: item.status,
      notes: item.notes,
      unitPrice,
      requestedTotal:
        unitPrice !== null
          ? Number((unitPrice * item.requestedQuantity).toFixed(2))
          : null,
      purchasedTotal:
        unitPrice !== null
          ? Number((unitPrice * item.purchasedQuantity).toFixed(2))
          : null,
    };
  }
}
