import { PartialType } from '@nestjs/mapped-types';
import { CreateShopListDto } from './create-shop-list.dto';

export class UpdateShopListDto extends PartialType(CreateShopListDto) {}
