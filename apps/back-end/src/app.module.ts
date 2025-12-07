import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage } from 'http';
import { validate } from './config/env.validation';
import { loggerConfig } from './config/logger.config';
import { UsersModule } from './users/users.module';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { TraceIdInterceptor } from './common/interceptors/trace-id.interceptor';
import AppDataSource from './config/typeorm.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { PrometheusController, PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/back-end/.env'],
      validate,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: IncomingMessage) => req.headers['x-request-id']?.toString() || uuidv4(),
      },
    }),
    LoggerModule.forRoot(loggerConfig),
    PrometheusModule.register({
      path: '/metrics',
      controller: PrometheusController,
      defaultMetrics: {
        enabled: true,
      },
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: undefined,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    MetricsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
  ],
})
export class AppModule {}
