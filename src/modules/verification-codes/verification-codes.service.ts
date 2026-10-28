import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { VerificationCode } from './entities/verification-code.entity';
import { VerificationCodePurpose } from './enums/verification-code-purpose.enum';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodesRepository: Repository<VerificationCode>,
    private readonly configService: ConfigService,
  ) {}

  // Gera um código numérico de seis dígitos.
  private generateCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  // Busca o código mais recente do usuário para uma finalidade.
  private async findLatestCode(
    userId: number,
    purpose: VerificationCodePurpose,
  ): Promise<VerificationCode | null> {
    return this.verificationCodesRepository.findOne({
      where: {
        userId,
        purpose,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  // Cria e armazena um código de verificação.
  async createCode(
    userId: number,
    purpose: VerificationCodePurpose,
  ): Promise<string> {
    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);

    const expirationMinutes = this.configService.getOrThrow<number>(
      'VERIFICATION_CODE_EXPIRATION_MINUTES',
    );

    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const verificationCode = this.verificationCodesRepository.create({
      userId,
      codeHash,
      purpose,
      expiresAt,
      attempts: 0,
      consumedAt: null,
    });

    await this.verificationCodesRepository.save(verificationCode);

    return code;
  }

  // Verifica se o usuário pode solicitar outro código.
  async getResendCooldownMessage(
    userId: number,
    purpose: VerificationCodePurpose,
  ): Promise<string | null> {
    const latestCode = await this.findLatestCode(userId, purpose);

    if (!latestCode) {
      return null;
    }

    const cooldownSeconds = this.configService.getOrThrow<number>(
      'VERIFICATION_CODE_RESEND_COOLDOWN_SECONDS',
    );

    const elapsedSeconds = Math.floor(
      (Date.now() - latestCode.createdAt.getTime()) / 1000,
    );

    const retryAfterSeconds = Math.max(0, cooldownSeconds - elapsedSeconds);

    if (retryAfterSeconds === 0) {
      return null;
    }

    return `Aguarde ${retryAfterSeconds} segundos antes de solicitar um novo código.`;
  }
}
