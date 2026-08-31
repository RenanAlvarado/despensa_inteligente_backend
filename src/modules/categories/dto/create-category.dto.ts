import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateCategoryDto {
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
