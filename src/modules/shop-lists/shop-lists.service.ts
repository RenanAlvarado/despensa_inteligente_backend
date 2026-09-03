import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopListDto } from './dto/create-shop-list.dto';
import { UpdateShopListDto } from './dto/update-shop-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingList } from './entities/shop-list.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
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
  async findAll(userId: number): Promise<ShoppingList[]> {
    const shoppingLists = await this.shoppingListRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return shoppingLists;
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
