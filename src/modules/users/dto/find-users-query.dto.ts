import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { UserRole } from '../enums/users-enums.enum';

export class FindUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'usuario@email.com',
    description: 'Filtra usuários pelo e-mail.',
  })
  @IsString({ message: 'E-mail deve ser uma string' })
  @MaxLength(255, {
    message: 'E-mail deve ter no máximo 255 caracteres',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Filtra usuários pelo perfil.',
  })
  @IsEnum(UserRole, {
    message: 'Perfil deve ser USER ou ADMIN',
  })
  @IsOptional()
  role?: UserRole;
}
