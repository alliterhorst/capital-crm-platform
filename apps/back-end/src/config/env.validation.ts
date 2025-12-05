import { z } from 'zod';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

const { IS_NOT_EMPTY, IS_NUMBER, MIN_LENGTH, IS_EMAIL } = MESSAGES_HELPER.VALIDATION;

const envSchema = z.object({
  DB_HOST: z.string(IS_NOT_EMPTY),
  DB_PORT: z.coerce.number(IS_NUMBER).min(1, MIN_LENGTH(1)),
  DB_USERNAME: z.string(IS_NOT_EMPTY),
  DB_PASSWORD: z.string(IS_NOT_EMPTY),
  DB_DATABASE: z.string(IS_NOT_EMPTY),
  ADMIN_EMAIL: z.email(IS_EMAIL),
  ADMIN_PASSWORD: z.string(IS_NOT_EMPTY),
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
