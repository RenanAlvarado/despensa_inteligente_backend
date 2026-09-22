import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  // Cadastro + autenticação
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(
      registerUserDto.email,
      registerUserDto.password,
    );

    return this.generateToken(user.id, user.email);
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

    return this.generateToken(user.id, user.email);
  }

  // Geração do JWT
  private async generateToken(
    userId: number,
    email: string,
  ): Promise<AuthResponseDto> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
