// Imports
import { z } from 'zod';

export function validateEnv(config: Record<string, unknown>) {
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
