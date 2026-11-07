import { BadRequestException, Injectable } from '@nestjs/common';
import type { PipeTransform, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ParseJsonDtoPipe<T extends object> implements PipeTransform<
  string,
  Promise<T>
> {
  constructor(private readonly dtoClass: Type<T>) {}

  async transform(value: string): Promise<T> {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('O campo data deve conter um JSON válido.');
    }

    let parsedData: unknown;

    try {
      parsedData = JSON.parse(value);
    } catch {
      throw new BadRequestException('O campo data contém um JSON inválido.');
    }

    if (
      typeof parsedData !== 'object' ||
      parsedData === null ||
      Array.isArray(parsedData)
    ) {
      throw new BadRequestException('O campo data deve conter um objeto JSON.');
    }

    const dto = plainToInstance(this.dtoClass, parsedData);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Erro de validação.',
        fields: Object.fromEntries(
          errors.map((error) => [
            error.property,
            Object.values(error.constraints ?? {})[0],
          ]),
        ),
      });
    }

    return dto;
  }
}
