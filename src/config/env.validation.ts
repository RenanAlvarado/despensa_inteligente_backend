// Imports
import { z } from 'zod';

export function validateEnv(config: Record<string, unknown>) {
  const envSchema = z.object({
    DB_HOST: z.string().min(1, 'DB_HOST is required'),

    DB_PORT: z.coerce
      .number()
      .int()
      .positive('DB_PORT must be a positive number'),

    DB_USER: z.string().min(1, 'DB_USER is required'),

    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),

    DB_NAME: z.string().min(1, 'DB_NAME is required'),
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
