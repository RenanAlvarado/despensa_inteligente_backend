import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    // Erros HTTP esperados
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json(
        typeof exceptionResponse === 'string'
          ? {
              statusCode: status,
              message: exceptionResponse,
            }
          : exceptionResponse,
      );
    }

    // Erro inesperado
    const error =
      exception instanceof Error ? exception : new Error(String(exception));

    const userId = (request as AuthenticatedRequest).user?.sub;

    const body = this.sanitizeBody(request.body);

    this.logger.error(
      [
        `Erro interno do servidor`,
        `Método: ${request.method}`,
        `Rota: ${request.path}`,
        `Status: ${HttpStatus.INTERNAL_SERVER_ERROR}`,
        `IP: ${request.ip}`,
        `Usuário: ${userId ?? 'Não autenticado'}`,
        `Body: ${JSON.stringify(body)}`,
        `Erro: ${error.message}`,
      ].join(' | '),
      error.stack,
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor.',
    });
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return body;
    }

    const sanitized = { ...(body as Record<string, unknown>) };

    const sensitiveFields = [
      'password',
      'passwordConfirmation',
      'accessToken',
      'refreshToken',
      'token',
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
