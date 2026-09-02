import { Module } from '@nestjs/common';
import { ShopListsService } from './shop-lists.service';
import { ShopListsController } from './shop-lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './entities/shop-list.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList]), UsersModule],
  controllers: [ShopListsController],
  providers: [ShopListsService],
})
export class ShopListsModule {}
