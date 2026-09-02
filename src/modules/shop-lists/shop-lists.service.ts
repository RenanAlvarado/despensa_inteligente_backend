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

  update(id: number, updateShopListDto: UpdateShopListDto) {
    return `This action updates a #${id} shopList`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopList`;
  }
}
