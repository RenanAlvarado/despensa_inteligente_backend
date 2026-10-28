import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly verificationCodesService: VerificationCodesService,
  ) {}

  // Cadastro + autenticação
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(
      registerUserDto.email,
      registerUserDto.password,
    );

    return this.generateToken(user.id, user.email, user.role);
  }

  // Login retornando Jwt
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  // Solicita o reenvio do código de confirmação de e-mail.
  async resendVerification(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const message =
      'Se a conta existir e estiver pendente de confirmação, você receberá um código por e-mail, caso a solicitação possa ser atendida.';

    const user = await this.usersService.findByEmail(
      resendVerificationDto.email,
    );

    if (!user || user.emailVerified) {
      return { message };
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

    console.log(code);

    return { message };
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
