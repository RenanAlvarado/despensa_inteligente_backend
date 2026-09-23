import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoriesQueryDto } from './dto/find-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categorias')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Criar Categoria
  @ApiOperation({
    summary: 'Cria uma categoria',
    description: 'Cadastra uma nova categoria.',
  })
  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso.',
  })
  @ApiConflictResponse({
    description: 'Já existe uma categoria cadastrada com este nome.',
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Listar Todas ou usar filtros
  @ApiOperation({
    summary: 'Lista categorias',
    description:
      'Lista as categorias cadastradas com suporte a paginação e filtro por nome.',
  })
  @ApiPaginatedResponse(CategoryResponseDto)
  @Get()
  findAll(@Query() query: FindCategoriesQueryDto) {
    return this.categoriesService.findAll(query);
  }

  // Buscar Por ID
  @ApiOperation({
    summary: 'Busca uma categoria por ID',
    description: 'Retorna uma categoria específica pelo seu identificador.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID da categoria.',
  })
  @ApiOkResponse({
    description: 'Categoria encontrada com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada.',
  })
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  // Atualizar Categoria
  @ApiOperation({
    summary: 'Atualiza uma categoria',
    description: 'Atualiza os dados de uma categoria existente.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID da categoria.',
  })
  @ApiOkResponse({
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada.',
  })
  @ApiConflictResponse({
    description: 'Já existe uma categoria cadastrada com este nome.',
  })
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Excluir
  @ApiOperation({
    summary: 'Exclui uma categoria',
    description: 'Exclui uma categoria que não esteja vinculada a produtos.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID da categoria.',
  })
  @ApiNoContentResponse({
    description: 'Categoria excluída com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Categoria não encontrada.',
  })
  @ApiConflictResponse({
    description:
      'A categoria não pode ser excluída porque possui produtos vinculados.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
