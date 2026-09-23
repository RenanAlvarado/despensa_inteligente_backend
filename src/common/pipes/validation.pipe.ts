import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

@Injectable()
export class AppValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,

      exceptionFactory: (errors: ValidationError[]) => {
        const fields: Record<string, string> = {};

        for (const error of errors) {
          const [message] = Object.values(error.constraints ?? {});

          if (message) {
            fields[error.property] = message;
          }
        }

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Erro de validação.',
          fields,
        });
      },
    });
  }
}
