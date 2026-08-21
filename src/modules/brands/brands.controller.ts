// Imports
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // Criar Marca
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  // Listar Todas ou usar filtros
  @Get()
  findAll(@Query('name') name?: string) {
    return this.brandsService.findAll(name);
  }

  // Buscar Por ID
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  // Atualizar Marca
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  // Excluir
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.brandsService.remove(id);
  }
}
