// Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomThrottlerGuard } from '../common/guards/throttler.guard';
import { validateEnv } from '../config/env.validation';
import { AuthModule } from '../modules/auth/auth.module';
import { BatchMovementsModule } from '../modules/batch-movements/batch-movements.module';
import { BatchesModule } from '../modules/batches/batches.module';
import { BrandsModule } from '../modules/brands/brands.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { HealthModule } from '../modules/health/health.module';
import { ProductsModule } from '../modules/products/products.module';
import { ShopListItemsModule } from '../modules/shop-list-items/shop-list-items.module';
import { ShopListsModule } from '../modules/shop-lists/shop-lists.module';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production.local'
          : '.env',
      validate: validateEnv,
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow<number>('THROTTLE_TTL'),
            limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),

        autoLoadEntities: true,

        synchronize: false,
      }),
    }),
    BrandsModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    BatchesModule,
    BatchMovementsModule,
    ShopListsModule,
    ShopListItemsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, // Rate Limiting global
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
