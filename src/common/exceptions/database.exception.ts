import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class DatabaseException extends ConflictException {
  constructor(error: QueryFailedError, message: string) {
    super(message);
  }
}
