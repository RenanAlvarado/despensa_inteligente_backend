import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/enums/users-enums.enum';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { VerificationCodePurpose } from '../verification-codes/enums/verification-code-purpose.enum';
import { VerificationCodesService } from '../verification-codes/verification-codes.service';
import { ResendVerificationDto } from '../verification-codes/dto/resend-verification.dto';
import { ResendVerificationResponseDto } from '../verification-codes/dto/resend-verification-response.dto';
import { VerifyEmailDto } from '../verification-codes/dto/verify-email.dto';
import { AuthMessageResponseDto } from './dto/auth-message-response.dto';
import { EmailsService } from '../emails/emails.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyPasswordResetCodeDto } from '../verification-codes/dto/verify-password-reset-code.dto';
import { ConfigService } from '@nestjs/config';
import { PasswordResetTokenResponseDto } from './dto/password-reset-token-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetTokenPayload } from './interfaces/password-reset-token-payload.interface';

const AUTH_MESSAGES = {
  FORGOT_PASSWORD:
    'Se a conta existir e estiver apta para recuperação, você receberá as instruções por e-mail.',
  INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  EMAIL_NOT_VERIFIED: 'Confirme seu e-mail antes de entrar.',
  INVALID_VERIFICATION_CODE: 'Código inválido ou expirado.',
  REGISTRATION_SUCCESS:
    'Cadastro realizado. Confirme seu e-mail utilizando o código recebido.',
  EMAIL_VERIFICATION_SUCCESS: 'E-mail confirmado com sucesso.',
  RESEND_VERIFICATION:
    'Se a conta existir e estiver pendente de confirmação, você receberá um código por e-mail, caso a solicitação possa ser atendida.',
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly verificationCodesService: VerificationCodesService,
    private readonly emailService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  // Cadastro + autenticação
  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<AuthMessageResponseDto> {
    const user = await this.usersService.create(
      registerUserDto.email,
      registerUserDto.password,
    );

    const code = await this.verificationCodesService.createCode(
      user.id,
      VerificationCodePurpose.EMAIL_VERIFICATION,
    );

    await this.emailService.sendVerificationCode(user.email, code);

    return {
      message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
    };
  }

  // Login retornando Jwt
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  // Solicita a recuperação de senha.
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<AuthMessageResponseDto> {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.emailVerified) {
      return { message: AUTH_MESSAGES.FORGOT_PASSWORD };
    }

    const purpose = VerificationCodePurpose.PASSWORD_RESET;

    const cooldownMessage =
      await this.verificationCodesService.getResendCooldownMessage(
        user.id,
        purpose,
      );

    if (cooldownMessage) {
      return { message: AUTH_MESSAGES.FORGOT_PASSWORD };
    }

    const code = await this.verificationCodesService.createCode(
      user.id,
      purpose,
    );

    await this.emailService.sendPasswordResetCode(user.email, code);

    return { message: AUTH_MESSAGES.FORGOT_PASSWORD };
  }

  // Verificar Código de Redefinição de Email
  async verifyPasswordResetCode(
    dto: VerifyPasswordResetCodeDto,
  ): Promise<PasswordResetTokenResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.emailVerified) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_VERIFICATION_CODE);
    }

    await this.verificationCodesService.verifyCode(
      user.id,
      VerificationCodePurpose.PASSWORD_RESET,
      dto.code,
    );

    const resetToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        purpose: 'password_reset',
      },
      {
        secret: this.configService.getOrThrow<string>(
          'PASSWORD_RESET_JWT_SECRET',
        ),
        expiresIn: this.configService.getOrThrow<number>(
          'PASSWORD_RESET_JWT_EXPIRES_IN',
        ),
      },
    );

    return { resetToken };
  }

  // Redefinir senha
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    resetTokenHeader: string | undefined,
  ): Promise<AuthMessageResponseDto> {
    if (!resetTokenHeader?.trim()) {
      throw new UnauthorizedException('Token de recuperação não informado.');
    }

    const resetToken = resetTokenHeader.trim();

    let payload: PasswordResetTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<PasswordResetTokenPayload>(
        resetToken,
        {
          secret: this.configService.getOrThrow<string>(
            'PASSWORD_RESET_JWT_SECRET',
          ),
        },
      );
    } catch {
      throw new UnauthorizedException(
        'Token de recuperação inválido ou expirado.',
      );
    }

    if (
      payload.purpose !== 'password_reset' ||
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0
    ) {
      throw new UnauthorizedException('Token de recuperação inválido.');
    }

    await this.usersService.resetPassword(
      payload.sub,
      resetPasswordDto.password,
    );

    return {
      message: 'Senha redefinida com sucesso. Faça login com sua nova senha.',
    };
  }

  // Solicita o reenvio do código de confirmação de e-mail.
  async resendVerification(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<ResendVerificationResponseDto> {
    const { email } = resendVerificationDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || user.emailVerified) {
      return { message: AUTH_MESSAGES.RESEND_VERIFICATION };
    }

    const purpose = VerificationCodePurpose.EMAIL_VERIFICATION;

    const cooldownMessage =
      await this.verificationCodesService.getResendCooldownMessage(
        user.id,
        purpose,
      );

    if (cooldownMessage) {
      return { message: cooldownMessage };
    }

    const code = await this.verificationCodesService.createCode(
      user.id,
      purpose,
    );

    await this.emailService.sendVerificationCode(user.email, code);

    return { message: AUTH_MESSAGES.RESEND_VERIFICATION };
  }

  // Confirmação do e-mail.
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(verifyEmailDto.email);

    if (!user || user.emailVerified) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_VERIFICATION_CODE);
    }

    await this.verificationCodesService.verifyCode(
      user.id,
      VerificationCodePurpose.EMAIL_VERIFICATION,
      verifyEmailDto.code,
    );

    await this.usersService.verifyEmail(user.id);

    return this.generateToken(user.id, user.email, user.role);
  }

  // Geração do JWT
  private async generateToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
