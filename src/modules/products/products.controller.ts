import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductByBarcodeDto } from './dto/create-product-barcode.dto';
import { CreateProductManualDto } from './dto/create-product-manual.dto';
import { ExternalProductResponseDto } from './dto/external-product-response.dto';
import { FindExternalProductsQueryDto } from './dto/find-external-products-query.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseImageFilePipe } from '../../common/pipes/parse-image-file.pipe';
import { JsonDtoBody } from '../../common/decorators/json-dto-body.decorator';

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
      'Cadastra um produto informando manualmente seus dados. Aceita uma URL ou um arquivo de imagem, mas não ambos simultaneamente.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateProductManualDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Imagem do produto. Formatos aceitos: JPEG, JPG, PNG e WebP. Tamanho máximo: 5 MB.',
        },
        data: {
          $ref: getSchemaPath(CreateProductManualDto),
        },
      },
      required: ['data'],
    },
  })
  @ApiCreatedResponse({
    description: 'Produto criado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiConflictResponse({
    description:
      'O código de barras já está cadastrado ou pertence a um produto encontrado na API externa.',
  })
  @ApiBadRequestResponse({
    description: 'Envie uma imagem por arquivo ou por URL, não ambos.',
  })
  @Post('manual')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  createManual(
    @JsonDtoBody(CreateProductManualDto)
    body: CreateProductManualDto,

    @UploadedFile(ParseImageFilePipe())
    file?: Express.Multer.File,
  ) {
    return this.productsService.createManual(body, file);
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
    summary: 'Lista produtos do Banco de Dados',
    description:
      'Lista os produtos cadastrados com suporte a paginação e filtros por nome, marca e categoria.',
  })
  @ApiPaginatedResponse(ProductResponseDto)
  @Get()
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  // Buscar produtos na API Open Food Facts
  @ApiOperation({
    summary: 'Busca produtos na Open Food Facts',
    description:
      'Realiza uma nova busca de produtos na API Open Food Facts utilizando o nome informado.',
  })
  @ApiPaginatedResponse(ExternalProductResponseDto)
  @ApiNotFoundResponse({
    description: 'Nenhum produto foi encontrado para o termo informado.',
  })
  @ApiResponse({
    status: 503,
    description: 'O serviço externo de consulta de produtos está indisponível.',
  })
  @Get('search')
  search(@Query() query: FindExternalProductsQueryDto) {
    return this.productsService.searchExternalProducts(query);
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
      'Atualiza os dados de um produto. Aceita os dados em JSON no campo "data" e, opcionalmente, uma imagem no campo "file". É possível informar uma URL de imagem ou enviar um arquivo, mas não ambos simultaneamente. Produtos obtidos da Open Food Facts possuem regras específicas: campos já preenchidos pela fonte externa não podem ser sobrescritos.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do produto.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateProductDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Imagem do produto. Formatos aceitos: JPEG, JPG, PNG e WebP. Tamanho máximo: 5 MB.',
        },
        data: {
          $ref: getSchemaPath(UpdateProductDto),
        },
      },
      required: ['data'],
    },
  })
  @ApiOkResponse({
    description: 'Produto atualizado com sucesso.',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Dados inválidos, arquivo de imagem inválido ou envio simultâneo de URL e arquivo.',
  })
  @ApiNotFoundResponse({
    description: 'Produto não encontrado.',
  })
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id', ParseIdPipe) id: string,

    @JsonDtoBody(UpdateProductDto)
    body: UpdateProductDto,

    @UploadedFile(ParseImageFilePipe())
    file?: Express.Multer.File,
  ) {
    return this.productsService.update(+id, body, file);
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

  // Testar upload de imagem
  @ApiOperation({
    summary: 'Testa o envio de uma imagem',
    description:
      'Recebe uma imagem e realiza o upload para o Cloudinary, sem vinculá-la a um produto.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'Imagem enviada com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Arquivo inválido ou maior que o limite permitido.',
  })
  @Post('test-upload')
  @UseInterceptors(FileInterceptor('file'))
  async testImageUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.productsService.testImageUpload(file);
  }
}
