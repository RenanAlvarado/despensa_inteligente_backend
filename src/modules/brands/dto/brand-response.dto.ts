import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class BrandResponseDto extends PickType(CreateBrandDto, [
  'name',
] as const) {
  @ApiProperty({
    example: 1,
    description: 'ID da marca.',
  })
  id!: number;
}
