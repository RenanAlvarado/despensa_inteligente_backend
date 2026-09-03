import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface PassportErrorInfo {
  name?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: PassportErrorInfo,
  ): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('O token de acesso expirou');
    }

    if (err || !user) {
      throw new UnauthorizedException('Token de acesso inválido');
    }

    return user;
  }
}
