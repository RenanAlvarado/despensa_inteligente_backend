import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResendVerificationResponseDto } from '../verification-codes/dto/resend-verification-response.dto';
import { ResendVerificationDto } from '../verification-codes/dto/resend-verification.dto';
import { VerifyEmailDto } from '../verification-codes/dto/verify-email.dto';
import { AuthMessageResponseDto } from './dto/auth-message-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyPasswordResetCodeDto } from '../verification-codes/dto/verify-password-reset-code.dto';
import { PasswordResetTokenResponseDto } from './dto/password-reset-token-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  // Cadastro
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
    type: AuthMessageResponseDto,
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

  // Solicitar recuperação de senha.
  @ApiOperation({
    summary: 'Solicita recuperação de senha',
    description:
      'Solicita o envio de um código de recuperação. A resposta não revela se o e-mail está cadastrado.',
  })
  @ApiOkResponse({
    description: 'Solicitação processada com uma mensagem genérica.',
    type: AuthMessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados da requisição inválidos.',
  })
  @ApiResponse({
    status: 429,
    description: 'Limite de solicitações excedido.',
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<AuthMessageResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // Verificar Código de Redefinição de Senha
  @Post('verify-password-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar código de recuperação de senha',
    description:
      'Valida o código enviado por e-mail para iniciar a redefinição de senha.',
  })
  @ApiOkResponse({
    description: 'Código validado com sucesso.',
    type: PasswordResetTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Código inválido, expirado ou e-mail não elegível.',
  })
  async verifyPasswordResetCode(
    @Body() dto: VerifyPasswordResetCodeDto,
  ): Promise<PasswordResetTokenResponseDto> {
    return this.authService.verifyPasswordResetCode(dto);
  }

  // Redefinir senha
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Redefinir senha com token de recuperação',
    description: 'Informe o resetToken no cabeçalho X-Password-Reset-Token.',
  })
  @ApiOkResponse({
    description: 'Senha redefinida com sucesso.',
    type: AuthMessageResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token de recuperação inválido ou expirado.',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Headers('x-password-reset-token') resetToken?: string,
  ): Promise<AuthMessageResponseDto> {
    return this.authService.resetPassword(dto, resetToken);
  }

  // Reenvio do código de confirmação de e-mail.
  @ApiOperation({
    summary: 'Solicita o reenvio do código de confirmação',
    description:
      'Solicita um novo código de confirmação de e-mail. A resposta é genérica para não revelar se o endereço está cadastrado.',
  })
  @ApiOkResponse({
    description: 'Solicitação processada com uma mensagem genérica.',
    type: ResendVerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados da requisição inválidos.',
  })
  @ApiResponse({
    status: 429,
    description: 'Limite de solicitações excedido.',
  })
  @Throttle({
    default: {
      limit: 15,
      ttl: 60_000,
    },
  })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    return this.authService.resendVerification(resendVerificationDto);
  }

  // Confirmar o e-mail do usuário.
  @ApiOperation({
    summary: 'Confirma o e-mail do usuário',
    description:
      'Valida o código recebido por e-mail e confirma a conta do usuário.',
  })
  @ApiOkResponse({
    description: 'E-mail confirmado com sucesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido, expirado ou e-mail já confirmado.',
  })
  @ApiResponse({
    status: 429,
    description: 'Limite de solicitações excedido.',
  })
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }
}
