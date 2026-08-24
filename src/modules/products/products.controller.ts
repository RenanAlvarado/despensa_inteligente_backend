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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Criar Produto
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Listar Todos ou Filtrar
  @Get()
  findAll() {
    return this.productsService.findAll();
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
