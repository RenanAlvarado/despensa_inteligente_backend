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
  Req,
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
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateShopListItemDto } from './dto/create-shop-list-item.dto';
import { FindShopListItemsQueryDto } from './dto/find-shop-list-items-query.dto';
import { ShopListItemResponseDto } from './dto/shop-list-item-response.dto';
import { UpdateShopListItemDto } from './dto/update-shop-list-item.dto';
import { ShopListItemsService } from './shop-list-items.service';

@ApiTags('Itens da Lista de Compras')
@ApiBearerAuth()
@Controller('shop-lists/:shopListId/items')
@UseGuards(JwtAuthGuard)
export class ShopListItemsController {
  constructor(private readonly shopListItemsService: ShopListItemsService) {}

  // Criar Item
  @ApiOperation({
    summary: 'Adiciona um item à lista de compras',
    description:
      'Adiciona um produto à lista de compras informada. O produto não pode estar presente anteriormente na mesma lista.',
  })
  @ApiParam({
    name: 'shopListId',
    example: 1,
    description: 'ID da lista de compras.',
  })
  @ApiCreatedResponse({
    description: 'Item adicionado à lista de compras com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Lista de compras ou produto não encontrado.',
  })
  @ApiConflictResponse({
    description: 'O produto já está presente na lista de compras.',
  })
  @ApiCreatedResponse({
    description: 'Item adicionado à lista de compras com sucesso.',
    type: ShopListItemResponseDto,
  })
  @Post()
  create(
    @Param('shopListId', ParseIdPipe) shopListId: number,
    @Req() request: AuthenticatedRequest,
    @Body() createShopListItemDto: CreateShopListItemDto,
  ) {
    const userId = request.user.sub;

    return this.shopListItemsService.create(
      shopListId,
      userId,
      createShopListItemDto,
    );
  }

  // Buscar todos ou filtrar
  @ApiOperation({
    summary: 'Lista os itens de uma lista de compras',
    description:
      'Retorna os itens da lista de compras com paginação e filtros por nome do produto e status.',
  })
  @ApiParam({
    name: 'shopListId',
    example: 1,
    description: 'ID da lista de compras.',
  })
  @ApiOkResponse({
    description: 'Itens da lista de compras encontrados com sucesso.',
  })
  @ApiNotFoundResponse({ description: 'Lista de compras não encontrada.' })
  @Get()
  findAll(
    @Param('shopListId', ParseIdPipe) shopListId: string,
    @Req() req: AuthenticatedRequest,
    @Query() query: FindShopListItemsQueryDto,
  ) {
    return this.shopListItemsService.findAll(+shopListId, req.user.sub, query);
  }

  // Listar Por ID
  @ApiOperation({
    summary: 'Busca um item da lista de compras por ID',
    description:
      'Retorna um item específico da lista de compras, incluindo os dados do produto relacionado.',
  })
  @ApiParam({
    name: 'shopListId',
    example: 1,
    description: 'ID da lista de compras.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do item da lista de compras.',
  })
  @ApiOkResponse({ description: 'Item encontrado com sucesso.' })
  @ApiNotFoundResponse({
    description: 'Lista de compras ou item não encontrado.',
  })
  @ApiOkResponse({
    description: 'Item encontrado com sucesso.',
    type: ShopListItemResponseDto,
  })
  @Get(':id')
  findOne(
    @Param('shopListId', ParseIdPipe) shopListId: number,
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListItemsService.findOne(id, shopListId, userId);
  }

  // Atualizar Item
  @ApiOperation({
    summary: 'Atualiza um item da lista de compras',
    description:
      'Atualiza os dados de um item, incluindo produto, quantidade solicitada, quantidade comprada, observações e preço unitário.',
  })
  @ApiParam({
    name: 'shopListId',
    example: 1,
    description: 'ID da lista de compras.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do item da lista de compras.',
  })
  @ApiOkResponse({ description: 'Item atualizado com sucesso.' })
  @ApiNotFoundResponse({
    description: 'Lista de compras, item ou produto não encontrado.',
  })
  @ApiConflictResponse({
    description: 'O produto informado já está presente na lista de compras.',
  })
  @ApiOkResponse({
    description: 'Item atualizado com sucesso.',
    type: ShopListItemResponseDto,
  })
  @Put(':id')
  update(
    @Param('shopListId', ParseIdPipe) shopListId: number,
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateShopListItemDto: UpdateShopListItemDto,
  ) {
    const userId = request.user.sub;

    return this.shopListItemsService.update(
      id,
      shopListId,
      userId,
      updateShopListItemDto,
    );
  }

  @ApiOperation({
    summary: 'Exclui um item da lista de compras',
    description: 'Remove um item da lista de compras.',
  })
  @ApiParam({
    name: 'shopListId',
    example: 1,
    description: 'ID da lista de compras.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID do item da lista de compras.',
  })
  @ApiNoContentResponse({ description: 'Item excluído com sucesso.' })
  @ApiNotFoundResponse({
    description: 'Lista de compras ou item não encontrado.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('shopListId', ParseIdPipe) shopListId: number,
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListItemsService.remove(id, shopListId, userId);
  }
}
