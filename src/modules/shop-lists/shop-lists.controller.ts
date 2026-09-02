import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShopListsService } from './shop-lists.service';
import { CreateShopListDto } from './dto/create-shop-list.dto';
import { UpdateShopListDto } from './dto/update-shop-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';

@Controller('shop-lists')
@UseGuards(JwtAuthGuard)
export class ShopListsController {
  constructor(private readonly shopListsService: ShopListsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createShopListDto: CreateShopListDto,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.create(userId, createShopListDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.shopListsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShopListDto: UpdateShopListDto,
  ) {
    return this.shopListsService.update(+id, updateShopListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopListsService.remove(+id);
  }
}
