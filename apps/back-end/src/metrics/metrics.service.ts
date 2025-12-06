import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientMetric } from './entities/client-metric.entity';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(ClientMetric)
    private readonly metricRepository: Repository<ClientMetric>,
  ) {}

  async createForClient(clientId: string, defaultViews = 0): Promise<void> {
    try {
      const metric = this.metricRepository.create({
        clientId,
        views: defaultViews,
      });
      await this.metricRepository.save(metric);
    } catch (error) {
      this.logger.error(MESSAGES_HELPER.METRICS.CREATE_ERROR, error);
    }
  }

  async incrementViews(clientId: string): Promise<void> {
    try {
      const result = await this.metricRepository.increment({ clientId }, 'views', 1);

      if (result.affected === 0) {
        await this.createForClient(clientId, 1);
      }
    } catch (error) {
      this.logger.error(MESSAGES_HELPER.METRICS.INCREMENT_ERROR, error);
    }
  }
}
