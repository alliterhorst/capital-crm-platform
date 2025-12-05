import { resolve } from 'path';

const BACKEND_ROOT = resolve(__dirname, '..', '..');
const SRC_ROOT = resolve(BACKEND_ROOT, 'src');

export const ENV_FILE_PATH = resolve(BACKEND_ROOT, '.env');
export const ENTITIES_PATH = resolve(SRC_ROOT, '**', '*.entity.{ts,js}');
export const MIGRATIONS_PATH = resolve(SRC_ROOT, 'database', 'migrations', '*.{ts,js}');
