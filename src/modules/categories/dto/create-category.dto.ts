import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Bebidas',
    description: 'Nome da categoria.',
    maxLength: 100,
  })
  @MaxLength(100, {
    message: 'Nome não pode ter mais de 100 caractéres',
  })
  @Trim()
  @IsString({
    message: 'Nome deve ser String',
  })
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  name!: string;
}
