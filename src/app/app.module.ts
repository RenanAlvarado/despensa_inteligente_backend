// Imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from '../config/env.validation';
import { BrandsModule } from '../modules/brands/brands.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ProductsModule } from '../modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Permitido de forma global sem precisar importar
      isGlobal: true,
      // Validação se todas as variáveis chegaram
      validate: validateEnv,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
