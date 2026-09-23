import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class CategoryResponseDto extends PickType(CreateCategoryDto, [
  'name',
] as const) {
  @ApiProperty({
    example: 1,
    description: 'ID da categoria.',
  })
  id!: number;
}
