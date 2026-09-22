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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';
import { CreateProductManualDto } from './dto/create-product-manual.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Criar Produto manualmente
  @ApiOperation({
    summary: 'Cadastra um produto manualmente',
    description:
      'Cadastra um produto informando manualmente seus dados. Caso seja informado um código de barras, ele será validado e consultado na API externa.',
  })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiConflictResponse({
    description:
      'O código de barras já está cadastrado ou pertence a um produto encontrado na API externa.',
  })
  @Post('manual')
  createManual(@Body() body: CreateProductManualDto) {
    return this.productsService.createManual(body);
  }

  // Criar Produto via código de barras
  @ApiOperation({
    summary: 'Cadastra um produto por código de barras',
    description:
      'Consulta o produto na API Open Food Facts utilizando o código de barras e cadastra os dados encontrados.',
  })
  @ApiCreatedResponse({
    description: 'Produto encontrado e cadastrado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiConflictResponse({
    description: 'Já existe um produto cadastrado com este código de barras.',
  })
  @ApiNotFoundResponse({
    description:
      'Nenhum produto foi encontrado na API externa para o código de barras informado.',
  })
  @ApiResponse({
    status: 503,
    description: 'O serviço externo de consulta de produtos está indisponível.',
  })
  @Post('barcode')
  createByBarcode(@Body() body: CreateProductByBarcodeDto) {
    return this.productsService.createByBarcode(body);
  }

  // Listar Todos ou Filtrar
  @ApiOperation({
    summary: 'Lista produtos',
    description:
      'Lista os produtos cadastrados com suporte a paginação e filtros por nome, marca e categoria.',
  })
  @ApiPaginatedResponse(ProductResponseDto)
  @Get()
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  // Buscar Por ID
  @ApiOperation({
    summary: 'Busca um produto por ID',
    description: 'Retorna um produto específico pelo seu identificador.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do produto.',
  })
  @ApiOkResponse({
    description: 'Produto encontrado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado.',
  })
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  // Atualizar Produto
  @ApiOperation({
    summary: 'Atualiza um produto',
    description:
      'Atualiza os dados de um produto. Produtos obtidos da Open Food Facts possuem regras específicas para atualização dos dados. Campos já preenchidos pela fonte externa não podem ser sobrescritos.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do produto.',
  })
  @ApiOkResponse({
    description: 'Produto atualizado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado.',
  })
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Excluir Produto
  @ApiOperation({
    summary: 'Exclui um produto',
    description:
      'Exclui um produto que não possua lotes ou itens de listas de compras relacionados.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do produto.',
  })
  @ApiNoContentResponse({
    description: 'Produto excluído com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado.',
  })
  @ApiConflictResponse({
    description:
      'O produto não pode ser excluído porque possui registros relacionados.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIdPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
