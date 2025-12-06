import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { envs } from '../../config/envs';

export const seedLogger = pino({
  level: envs.LOG_LEVEL,
  base: {
    context: 'SeedScript',
    pid: process.pid,
    traceId: uuidv4(),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
