import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
  data!: T[];
  meta!: PaginationMetaDto;
}
