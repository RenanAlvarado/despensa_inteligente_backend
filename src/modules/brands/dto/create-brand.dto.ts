import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString({
    message: 'Nome deve ser String',
  })
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  @MaxLength(100, {
    message: 'Nome não pode ter mais de 100 caractéres',
  })
  name!: string;
}
