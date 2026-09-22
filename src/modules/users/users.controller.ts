import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from './enums/users-enums.enum';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Listar Todos ou filtrar
  @ApiOperation({
    summary: 'Busca todos os usuários',
    description: 'Retorna uma pesquisa de todos os usuários',
  })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiForbiddenResponse({
    description: 'Usuário autenticado não possui permissão de administrador.',
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  async findAll(@Query() query: FindUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  // Buscar Por ID
  @ApiOperation({
    summary: 'Busca o usuário autenticado',
    description:
      'Retorna os dados do usuário autenticado através do token JWT. A senha não é retornada.',
  })
  @ApiOkResponse({
    description: 'Dados do usuário encontrados com sucesso.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @Get()
  findOne(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.usersService.findOne(userId);
  }

  // Atualizar Senha
  @ApiOperation({
    summary: 'Atualiza a senha do usuário',
    description:
      'Atualiza a senha do usuário autenticado. A nova senha deve atender aos critérios de validação definidos pela API.',
  })
  @ApiOkResponse({
    description: 'Senha atualizada com sucesso.',
    schema: { example: { message: 'Senha atualizada com sucesso.' } },
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @Patch()
  update(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request.user.sub;

    return this.usersService.update(userId, updateUserDto);
  }

  // Deletar Usuário
  @ApiOperation({
    summary: 'Exclui o usuário autenticado',
    description:
      'Exclui permanentemente a conta do usuário autenticado e os dados relacionados conforme as regras de integridade da aplicação.',
  })
  @ApiNoContentResponse({ description: 'Usuário excluído com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.usersService.remove(userId);
  }
}
