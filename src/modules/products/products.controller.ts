import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductManualDto } from './dto/create-product-manual.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Criar Produto
  @Post('manual')
  createManual(@Body() body: CreateProductManualDto) {
    return this.productsService.createManual(body);
  }

  @Post('barcode')
  createByBarcode(@Body() body: CreateProductByBarcodeDto) {
    return this.productsService.createByBarcode(body);
  }

  // Listar Todos ou Filtrar
  @Get()
  findAll(@Query('name') name?: string) {
    return this.productsService.findAll(name);
  }

  // Buscar Por ID
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  // Atualizar Produto
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Excluir Produto
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
