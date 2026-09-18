import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from '../brands/brands.module';
import { CategoriesModule } from '../categories/categories.module';
import { OpenFoodFactsModule } from '../open-food-facts/open-food-facts.module';
import { ShopListItemsModule } from '../shop-list-items/shop-list-items.module';
import { BatchesModule } from '../batches/batches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => BrandsModule),
    forwardRef(() => CategoriesModule),
    OpenFoodFactsModule,
    forwardRef(() => ShopListItemsModule),
    forwardRef(() => BatchesModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
