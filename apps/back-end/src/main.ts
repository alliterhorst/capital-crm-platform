import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { MESSAGES_HELPER } from './common/constants/messages.helper';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true });

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return new BadRequestException({
          statusCode: 400,
          message: MESSAGES_HELPER.EXCEPTION.BAD_REQUEST,
          errors: formattedErrors,
          timestamp: new Date().toISOString(),
        });
      },
    }),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app);

  await app.listen(envs.PORT);

  const logger = app.get(Logger);
  logger.log(`🚀 Application is running on: http://localhost:${envs.PORT}/${globalPrefix}`);
  logger.log(`📑 Swagger Documentation: http://localhost:${envs.PORT}/docs`);
}

bootstrap();
