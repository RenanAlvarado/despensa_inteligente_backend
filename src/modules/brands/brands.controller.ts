// Imports
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BrandsService } from './brands.service';
import { BrandResponseDto } from './dto/brand-response.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FindBrandsQueryDto } from './dto/find-brands-query.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Marcas')
@ApiBearerAuth()
@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  // Criar Marca
  @ApiOperation({
    summary: 'Cria uma marca',
    description: 'Cadastra uma nova marca.',
  })
  @ApiCreatedResponse({
    description: 'Marca criada com sucesso.',
    type: BrandResponseDto,
  })
  @ApiConflictResponse({
    description: 'Já existe uma marca cadastrada com este nome.',
  })
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  // Listar Todas ou usar filtros
  @ApiOperation({
    summary: 'Lista marcas',
    description:
      'Lista as marcas cadastradas com suporte a paginação e filtro por nome.',
  })
  @ApiPaginatedResponse(BrandResponseDto)
  @Get()
  findAll(@Query() query: FindBrandsQueryDto) {
    return this.brandsService.findAll(query);
  }

  // Buscar Por ID
  @ApiOperation({
    summary: 'Busca uma marca por ID',
    description: 'Retorna uma marca específica pelo seu identificador.',
  })
  @ApiOkResponse({
    description: 'Marca encontrada com sucesso.',
    type: BrandResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Marca não encontrada.',
  })
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  // Atualizar Marca
  @ApiOperation({
    summary: 'Atualiza uma marca',
    description: 'Atualiza os dados de uma marca existente.',
  })
  @ApiOkResponse({
    description: 'Marca atualizada com sucesso.',
    type: BrandResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Marca não encontrada.',
  })
  @ApiConflictResponse({
    description: 'Já existe uma marca cadastrada com este nome.',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  // Excluir
  @ApiOperation({
    summary: 'Exclui uma marca',
    description: 'Exclui uma marca que não esteja vinculada a produtos.',
  })
  @ApiNoContentResponse({
    description: 'Marca excluída com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Marca não encontrada.',
  })
  @ApiConflictResponse({
    description:
      'A marca não pode ser excluída porque possui produtos vinculados.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.brandsService.remove(id);
  }
}
