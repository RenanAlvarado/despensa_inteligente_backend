// Imports
import { z } from 'zod';

export function validateEnv(config: Record<string, unknown>) {
  const envSchema = z.object({
    PORT: z.coerce.number().int().positive('PORT deve ser um número positivo'),

    DB_HOST: z.string().min(1, 'DB_HOST is required'),

    DB_PORT: z.coerce
      .number()
      .int()
      .positive('DB_PORT must be a positive number'),

    DB_USER: z.string().min(1, 'DB_USER is required'),

    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),

    DB_NAME: z.string().min(1, 'DB_NAME is required'),

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
    console.error('Environment validation failed:');

    result.error.issues.forEach((issue) => {
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    });

    process.exit(1);
  }

  return result.data;
}
