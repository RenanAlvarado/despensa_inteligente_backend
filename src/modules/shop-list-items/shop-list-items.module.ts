import { Module } from '@nestjs/common';
import { ShopListItemsService } from './shop-list-items.service';
import { ShopListItemsController } from './shop-list-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopListItem } from './entities/shop-list-item.entity';
import { ShopListsModule } from '../shop-lists/shop-lists.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopListItem]),
    ShopListsModule,
    ProductsModule,
  ],
  controllers: [ShopListItemsController],
  providers: [ShopListItemsService],
})
export class ShopListItemsModule {}
