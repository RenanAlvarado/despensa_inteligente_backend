import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Autenticação')
@Controller('auth')
@Throttle({
  default: {
    limit: 5,
    ttl: 60_000,
  },
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Cadastra um usuário',
    description:
      'Cria um novo usuário e realiza a autenticação automaticamente, retornando um token JWT.',
  })
  @ApiConflictResponse({
    description: 'Já existe um usuário cadastrado com esse email.',
  })
  @ApiResponse({
    status: 429,
    description: 'Excesso de chamadas.',
  })
  @ApiCreatedResponse({
    description: 'Usuário cadastrado e autenticado com sucesso.',
    type: AuthResponseDto,
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // Login
  @ApiOperation({
    summary: 'Realiza login',
    description: 'Autentica o usuário e retorna um token JWT.',
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou senha inválidos.',
  })
  @ApiResponse({
    status: 429,
    description: 'Excesso de chamadas',
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso.',
    type: AuthResponseDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
