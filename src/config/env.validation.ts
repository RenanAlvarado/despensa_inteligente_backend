// Imports
import { z } from 'zod';

export function validateEnv(config: Record<string, unknown>) {
  const nodeEnv =
    typeof config.NODE_ENV === 'string' ? config.NODE_ENV : undefined;

  const envFile = nodeEnv === 'production' ? '.env.production.local' : '.env';

  console.log(`[ENV] Ambiente: ${nodeEnv ?? 'não definido'}`);
  console.log(`[ENV] Arquivo selecionado: ${envFile}`);

  const envSchema = z.object({
    NODE_ENV: z
      .enum(['development', 'production'], {
        message: 'NODE_ENV deve ser development ou production',
      })
      .default('development'),

    PORT: z.coerce.number().int().positive('PORT deve ser um número positivo'),

    DB_HOST: z.string().min(1, 'DB_HOST é obrigatório'),

    DB_PORT: z.coerce
      .number()
      .int()
      .positive('DB_PORT deve ser um número positivo'),

    DB_USER: z.string().min(1, 'DB_USER é obrigatório'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD é obrigatório'),
    DB_NAME: z.string().min(1, 'DB_NAME é obrigatório'),

    JWT_SECRET: z
      .string()
      .min(32, 'JWT_SECRET deve possuir pelo menos 32 caracteres'),

    JWT_EXPIRES_IN: z
      .string()
      .regex(
        /^\d+(s|m|h|d|w|y)$/,
        'JWT_EXPIRES_IN deve possuir um formato válido, como 1h, 1d ou 7d',
      ),

    CORS_ORIGIN: z.string().url('CORS_ORIGIN deve ser uma URL válida'),

    THROTTLE_TTL: z.coerce
      .number()
      .int()
      .positive('THROTTLE_TTL deve ser um número positivo'),

    THROTTLE_LIMIT: z.coerce
      .number()
      .int()
      .positive('THROTTLE_LIMIT deve ser um número positivo'),

    VERIFICATION_CODE_EXPIRATION_MINUTES: z.coerce
      .number()
      .int('VERIFICATION_CODE_EXPIRATION_MINUTES deve ser um número inteiro')
      .positive(
        'VERIFICATION_CODE_EXPIRATION_MINUTES deve ser um número positivo',
      )
      .default(10),

    VERIFICATION_CODE_RESEND_COOLDOWN_SECONDS: z.coerce
      .number()
      .int(
        'VERIFICATION_CODE_RESEND_COOLDOWN_SECONDS deve ser um número inteiro',
      )
      .positive(
        'VERIFICATION_CODE_RESEND_COOLDOWN_SECONDS deve ser um número positivo',
      )
      .default(60),

    VERIFICATION_CODE_MAX_ATTEMPTS: z.coerce
      .number()
      .int('VERIFICATION_CODE_MAX_ATTEMPTS deve ser um número inteiro')
      .positive('VERIFICATION_CODE_MAX_ATTEMPTS deve ser um número positivo')
      .default(5),

    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY é obrigatória'),

    EMAIL_FROM: z
      .string()
      .email('EMAIL_FROM deve ser um endereço de e-mail válido'),
  });

  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('Falha na validação das variáveis de ambiente:');

    result.error.issues.forEach((issue) => {
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    });

    process.exit(1);
  }

  return result.data;
}
