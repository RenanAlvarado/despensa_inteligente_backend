import { PartialType } from '@nestjs/mapped-types';
import { CreateProductManualDto } from './create-product-manual.dto';

export class UpdateProductDto extends PartialType(CreateProductManualDto) {}
