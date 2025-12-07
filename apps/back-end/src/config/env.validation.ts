import { z } from 'zod';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

const { IS_NOT_EMPTY, IS_NUMBER, MIN_LENGTH, IS_EMAIL } = MESSAGES_HELPER.VALIDATION;

const envSchema = z.object({
  PORT: z.coerce.number(IS_NUMBER).min(1, MIN_LENGTH(1)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  SEED_MOCK_DATA: z
    .string()
    .transform((val) => val === 'true')
    .default(false),
  DB_HOST: z.string(IS_NOT_EMPTY),
  DB_PORT: z.coerce.number(IS_NUMBER).min(1, MIN_LENGTH(1)),
  DB_USERNAME: z.string(IS_NOT_EMPTY),
  DB_PASSWORD: z.string(IS_NOT_EMPTY),
  DB_DATABASE: z.string(IS_NOT_EMPTY),
  ADMIN_EMAIL: z.email(IS_EMAIL),
  ADMIN_PASSWORD: z.string(IS_NOT_EMPTY),
  JWT_SECRET: z.string(IS_NOT_EMPTY).min(16, MIN_LENGTH(16)),
  JWT_EXPIRES_IN: z.string(IS_NOT_EMPTY).default('1d'),
});

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(result.error.format());
    throw new Error('Environment validation error');
  }

  return result.data;
}
