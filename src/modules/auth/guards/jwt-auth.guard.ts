import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface PassportErrorInfo {
  name?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: PassportErrorInfo,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token de acesso não informado.');
    }

    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('O token de acesso expirou.');
    }

    if (err || !user) {
      throw new UnauthorizedException('Token de acesso inválido.');
    }

    return user;
  }
}
