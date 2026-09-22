import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../common/enums/order-filter.enum';
import { UsersService } from '../users/users.service';
import { CreateShopListDto } from './dto/create-shop-list.dto';
import { FindShopListsQueryDto } from './dto/find-shop-lists-query.dto';
import { UpdateShopListDto } from './dto/update-shop-list.dto';
import { ShoppingList } from './entities/shop-list.entity';
import { ShoppingListStatus } from './enums/shop-lists.enums';

@Injectable()
export class ShopListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,

    private readonly usersService: UsersService,
  ) {}

  // Criar Lista de Compras
  async create(
    userId: number,
    createShoppingListDto: CreateShopListDto,
  ): Promise<ShoppingList> {
    await this.usersService.findOne(userId);

    const shoppingList = this.shoppingListRepository.create({
      userId,
      name: createShoppingListDto.name,
      status: ShoppingListStatus.OPEN,
      budgetLimit:
        createShoppingListDto.budgetLimit !== undefined
          ? String(createShoppingListDto.budgetLimit)
          : null,
    });

    return this.shoppingListRepository.save(shoppingList);
  }

  // Buscar todos
  async findAll(userId: number, query: FindShopListsQueryDto) {
    const { page = 1, limit = 10, order = Order.DESC, name, status } = query;

    const queryBuilder = this.shoppingListRepository
      .createQueryBuilder('shopList')
      .where('shopList.userId = :userId', {
        userId,
      });

    if (name !== undefined) {
      queryBuilder.andWhere('shopList.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('shopList.status = :status', {
        status,
      });
    }

    const skip = (page - 1) * limit;

    queryBuilder
      .orderBy('shopList.createdAt', order)
      .addOrderBy('shopList.id', order)
      .skip(skip)
      .take(limit);

    const [shoppingLists, total] = await queryBuilder.getManyAndCount();

    return {
      data: shoppingLists,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Lista por ID
  async findOne(id: number, userId: number): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!shoppingList) {
      throw new NotFoundException('Lista de compras não encontrada.');
    }

    return shoppingList;
  }

  // Atualizar Lista
  async update(
    id: number,
    userId: number,
    updateShopListDto: UpdateShopListDto,
  ): Promise<ShoppingList> {
    const shoppingList = await this.findOne(id, userId);

    if (updateShopListDto.name !== undefined) {
      shoppingList.name = updateShopListDto.name;
    }

    if (updateShopListDto.budgetLimit !== undefined) {
      shoppingList.budgetLimit =
        updateShopListDto.budgetLimit !== null
          ? String(updateShopListDto.budgetLimit)
          : null;
    }

    if (updateShopListDto.status !== undefined) {
      shoppingList.status = updateShopListDto.status;
    }

    return this.shoppingListRepository.save(shoppingList);
  }

  // Excluir Lista
  async remove(id: number, userId: number): Promise<void> {
    const shoppingList = await this.findOne(id, userId);

    await this.shoppingListRepository.remove(shoppingList);
  }
}
