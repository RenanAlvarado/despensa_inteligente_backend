import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ShopListsService } from './shop-lists.service';
import { CreateShopListDto } from './dto/create-shop-list.dto';
import { UpdateShopListDto } from './dto/update-shop-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { FindShopListsQueryDto } from './dto/find-shop-lists-query.dto';

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
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindShopListsQueryDto,
  ) {
    return this.shopListsService.findAll(req.user.sub, query);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateShopListDto: UpdateShopListDto,
  ) {
    const userId = request.user.sub;

    return this.shopListsService.update(id, userId, updateShopListDto);
  }

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
