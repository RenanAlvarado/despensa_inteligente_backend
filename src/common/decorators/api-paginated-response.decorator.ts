import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { PaginationMetaDto } from '../dto/pagination-meta.dto';

export function ApiPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
) {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PaginatedResponseDto),
          },
        ],
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(model),
            },
          },
          meta: {
            $ref: getSchemaPath(PaginationMetaDto),
          },
        },
      },
    }),
  );
}
