import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { ParseJsonDtoPipe } from '../pipes/parse-json-dto.pipe';

export function JsonDtoBody<T extends object>(
  dtoClass: Type<T>,
): ParameterDecorator {
  const decorator = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<{
        body?: Record<string, unknown>;
      }>();

      return request.body?.data;
    },
  );

  return decorator(undefined, new ParseJsonDtoPipe(dtoClass));
}
