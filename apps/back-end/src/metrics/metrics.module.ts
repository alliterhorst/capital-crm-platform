import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientMetric } from './entities/client-metric.entity';
import { MetricsService } from './metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientMetric])],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
