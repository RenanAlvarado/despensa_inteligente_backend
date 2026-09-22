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
import { CreateShopListDto } from './dto/create-shop-list.dto';
import { FindShopListsQueryDto } from './dto/find-shop-lists-query.dto';
import { UpdateShopListDto } from './dto/update-shop-list.dto';
import { ShopListsService } from './shop-lists.service';

@ApiTags('Listas de Compras')
@ApiBearerAuth()
@Controller('shop-lists')
@UseGuards(JwtAuthGuard)
export class ShopListsController {
  constructor(private readonly shopListsService: ShopListsService) {}

  // Criar Lista
  @ApiOperation({
    summary: 'Cria uma lista de compras',
    description:
      'Cria uma nova lista de compras para o usuário autenticado. A lista é criada inicialmente com status ABERTA.',
  })
  @ApiCreatedResponse({ description: 'Lista de compras criada com sucesso.' })
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createShopListDto: CreateShopListDto,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.create(userId, createShopListDto);
  }

  // Buscar Todas ou filtrar
  @ApiOperation({
    summary: 'Lista as listas de compras',
    description:
      'Retorna as listas de compras do usuário autenticado com suporte a paginação, ordenação e filtros por nome e status.',
  })
  @ApiOkResponse({ description: 'Listas de compras encontradas com sucesso.' })
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindShopListsQueryDto,
  ) {
    return this.shopListsService.findAll(req.user.sub, query);
  }

  // Buscar por ID
  @ApiOperation({
    summary: 'Busca uma lista de compras por ID',
    description:
      'Retorna uma lista de compras específica pertencente ao usuário autenticado.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID da lista de compras.' })
  @ApiOkResponse({ description: 'Lista de compras encontrada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Lista de compras não encontrada.' })
  @Get(':id')
  findOne(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.findOne(id, userId);
  }

  // Atualizar Lista
  @ApiOperation({
    summary: 'Atualiza uma lista de compras',
    description:
      'Atualiza o nome, limite de orçamento ou status de uma lista de compras existente.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID da lista de compras.' })
  @ApiOkResponse({ description: 'Lista de compras atualizada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Lista de compras não encontrada.' })
  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateShopListDto: UpdateShopListDto,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.update(id, userId, updateShopListDto);
  }

  // Excluir Lista
  @ApiOperation({
    summary: 'Exclui uma lista de compras',
    description:
      'Exclui uma lista de compras pertencente ao usuário autenticado.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID da lista de compras.' })
  @ApiNoContentResponse({
    description: 'Lista de compras excluída com sucesso.',
  })
  @ApiNotFoundResponse({ description: 'Lista de compras não encontrada.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.remove(id, userId);
  }
}
