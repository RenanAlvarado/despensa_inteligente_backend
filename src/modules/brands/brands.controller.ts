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
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindBrandsQueryDto } from './dto/find-brands-query.dto';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // Criar Marca
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  // Listar Todas ou usar filtros
  @Get()
  findAll(@Query() query: FindBrandsQueryDto) {
    return this.brandsService.findAll(query);
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
