import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimingInterceptor.name);
  private readonly slowRequestThreshold = 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const start = performance.now();

    return next.handle().pipe(
      tap({
        next: () => this.logDuration(request, start),
        error: () => this.logDuration(request, start),
      }),
    );
  }

  private logDuration(request: Request, start: number): void {
    const duration = performance.now() - start;
    const message = `${request.method} ${request.path} - ${duration.toFixed(2)}ms`;

    if (duration >= this.slowRequestThreshold) {
      this.logger.warn(`Requisição lenta: ${message}`);
      return;
    }

    this.logger.log(message);
  }
}
