import { Params } from 'nestjs-pino';
import { pino } from 'pino';
import { envs } from './envs';

export const loggerConfig: Params = {
  pinoHttp: {
    level: envs.LOG_LEVEL,
    autoLogging: true,
    transport: envs.LOG_PRETTY
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
    },
    redact: {
      paths: ['req.headers.authorization', 'req.body.password'],
      remove: true,
    },
    customProps: (req) => ({
      traceId: req.id,
      context: 'HTTP',
    }),
    timestamp: pino.stdTimeFunctions.isoTime,
  },
};
