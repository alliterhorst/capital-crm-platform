import { config } from 'dotenv';
import { validate } from './env.validation';
import { ENV_FILE_PATH } from './paths';

config({ path: ENV_FILE_PATH });

export const envs = validate(process.env);
