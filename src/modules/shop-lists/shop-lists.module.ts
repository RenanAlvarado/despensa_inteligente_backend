import { forwardRef, Module } from '@nestjs/common';
import { ShopListsService } from './shop-lists.service';
import { ShopListsController } from './shop-lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingList } from './entities/shop-list.entity';
import { UsersModule } from '../users/users.module';
import { ShopListItemsModule } from '../shop-list-items/shop-list-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList]),
    UsersModule,
    forwardRef(() => ShopListItemsModule),
  ],
  controllers: [ShopListsController],
  providers: [ShopListsService],
  exports: [ShopListsService],
})
export class ShopListsModule {}
