import { Injectable } from '@nestjs/common';
import { CreateShopListItemDto } from './dto/create-shop-list-item.dto';
import { UpdateShopListItemDto } from './dto/update-shop-list-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopListItem } from './entities/shop-list-item.entity';
import { Repository } from 'typeorm';
import { ShopListsService } from '../shop-lists/shop-lists.service';
import { ProductsService } from '../products/products.service';
import { ShoppingListItemStatus } from './enums/shop-list-item.enum';

@Injectable()
export class ShopListItemsService {
  constructor(
    @InjectRepository(ShopListItem)
    private readonly shopListItemRepository: Repository<ShopListItem>,

    private readonly shopListsService: ShopListsService,

    private readonly productsService: ProductsService,
  ) {}

  // Criar Item da lista de compras
  async create(
    shopListId: number,
    userId: number,
    createShopListItemDto: CreateShopListItemDto,
  ): Promise<ShopListItem> {
    // Validação
    await this.shopListsService.findOne(shopListId, userId);

    await this.productsService.findOne(createShopListItemDto.productId);

    const shopListItem = this.shopListItemRepository.create({
      shoppingListId: shopListId,
      productId: createShopListItemDto.productId,
      requestedQuantity: createShopListItemDto.requestedQuantity,
      purchasedQuantity: 0,
      status: ShoppingListItemStatus.PENDING,
      notes: createShopListItemDto.notes ?? null,
      unitPrice: null,
    });

    return this.shopListItemRepository.save(shopListItem);
  }

  findAll() {
    return `This action returns all shopListItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopListItem`;
  }

  update(id: number, updateShopListItemDto: UpdateShopListItemDto) {
    return `This action updates a #${id} shopListItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopListItem`;
  }
}
