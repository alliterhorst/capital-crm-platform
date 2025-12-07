import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientMetric } from './entities/client-metric.entity';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { Client } from '../clients/entities/client.entity';
import { MonthlyGrowthDto } from './dto/growth-response.dto';
import { RawGrowthData } from './interfaces/raw-growth.interfaces';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(ClientMetric)
    private readonly metricRepository: Repository<ClientMetric>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
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

  async getDashboardData(): Promise<DashboardResponseDto> {
    this.logger.log('Calculating dashboard metrics...');

    const { totalClients, totalValue, avgSalary } = await this.clientRepository
      .createQueryBuilder('client')
      .select('COUNT(client.id)', 'totalClients')
      .addSelect('SUM(client.companyValue)', 'totalValue')
      .addSelect('AVG(client.salary)', 'avgSalary')
      .getRawOne();

    const topClientsRaw = await this.metricRepository.find({
      order: { views: 'DESC' },
      take: 5,
      relations: ['client'],
    });

    const topViewedClients = topClientsRaw
      .filter((m) => m.client)
      .map((metric) => ({
        id: metric.client.id,
        name: metric.client.name,
        views: metric.views,
        companyValue: metric.client.companyValue,
        createdAt: metric.client.createdAt,
        updatedAt: metric.client.updatedAt,
      }));

    this.logger.log('Dashboard metrics calculated successfully');

    return {
      totalClients: Number(totalClients) || 0,
      totalCompanyValue: Number(totalValue) || 0,
      averageSalary: Number(avgSalary) || 0,
      topViewedClients,
    };
  }

  async getGrowthMetrics(): Promise<MonthlyGrowthDto[]> {
    this.logger.log('Calculating growth metrics for charts...');

    const rawData = await this.clientRepository.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(id) as count,
        SUM("companyValue") as value
      FROM clients
      WHERE deleted_at IS NULL
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `);

    return rawData.map((row: RawGrowthData) => ({
      month: row.month,
      count: Number(row.count),
      totalCompanyValue: Number(row.value),
    }));
  }
}
