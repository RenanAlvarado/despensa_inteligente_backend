import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShopListItemsService } from './shop-list-items.service';
import { CreateShopListItemDto } from './dto/create-shop-list-item.dto';
import { UpdateShopListItemDto } from './dto/update-shop-list-item.dto';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shop-list-items')
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
  findAll() {
    return this.shopListItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopListItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShopListItemDto: UpdateShopListItemDto,
  ) {
    return this.shopListItemsService.update(+id, updateShopListItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopListItemsService.remove(+id);
  }
}
