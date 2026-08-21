import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class ParseIdPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () =>
        new BadRequestException('O ID deve ser um número'),
    });
  }
}
