import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ShopListItemsService } from './shop-list-items.service';
import { CreateShopListItemDto } from './dto/create-shop-list-item.dto';
import { UpdateShopListItemDto } from './dto/update-shop-list-item.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindShopListItemsQueryDto } from './dto/find-shop-list-items-query.dto';

@Controller('shop-lists/:shopListId/items')
@UseGuards(JwtAuthGuard)
export class ShopListItemsController {
  constructor(private readonly shopListItemsService: ShopListItemsService) {}

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

  @Get()
  findAll(
    @Param('shopListId', ParseIdPipe) shopListId: string,
    @Req() req: AuthenticatedRequest,
    @Query() query: FindShopListItemsQueryDto,
  ) {
    return this.shopListItemsService.findAll(+shopListId, req.user.sub, query);
  }

  @Get(':id')
  findOne(
    @Param('shopListId', ParseIdPipe) shopListId: number,
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListItemsService.findOne(id, shopListId, userId);
  }

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
