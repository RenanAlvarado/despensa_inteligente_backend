import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Criar Categoria
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Listar Todas ou usar filtros
  @Get()
  findAll(@Query('name') name?: string) {
    return this.categoriesService.findAll(name);
  }

  // Buscar Por ID
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  // Atualizar Categoria
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Excluir
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
