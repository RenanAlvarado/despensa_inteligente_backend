import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'node:crypto';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodesRepository: Repository<VerificationCode>,
  ) {}

  // Gera um código numérico de seis dígitos.
  private generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }
}
