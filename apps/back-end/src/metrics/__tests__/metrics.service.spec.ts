import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, SelectQueryBuilder } from 'typeorm';
import { MetricsService } from '../metrics.service';
import { ClientMetric } from '../entities/client-metric.entity';
import { Client } from '../../clients/entities/client.entity';

interface RawDashboardData {
  totalClients: string;
  totalValue: string;
  avgSalary: string;
}

interface RawGrowthData {
  month: string;
  count: string;
  value: string;
}

describe('MetricsService', () => {
  let service: MetricsService;
  let metricRepository: jest.Mocked<Repository<ClientMetric>>;
  let clientRepository: jest.Mocked<Repository<Client>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: getRepositoryToken(ClientMetric),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            increment: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {
            createQueryBuilder: jest.fn(),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    metricRepository = module.get(getRepositoryToken(ClientMetric));
    clientRepository = module.get(getRepositoryToken(Client));

    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createForClient should create and save metric', async () => {
    const clientId = 'client-1';
    const mockMetric: Partial<ClientMetric> = { clientId, views: 0 };

    metricRepository.create.mockReturnValue(mockMetric as ClientMetric);
    metricRepository.save.mockResolvedValue(mockMetric as ClientMetric);

    await service.createForClient(clientId);

    expect(metricRepository.create).toHaveBeenCalledWith({ clientId, views: 0 });
    expect(metricRepository.save).toHaveBeenCalled();
  });

  it('incrementViews should increment metric when exists', async () => {
    const mockUpdateResult: UpdateResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    metricRepository.increment.mockResolvedValue(mockUpdateResult);

    await service.incrementViews('client-1');

    expect(metricRepository.increment).toHaveBeenCalledWith({ clientId: 'client-1' }, 'views', 1);
  });

  it('incrementViews should create metric when not exists', async () => {
    const spy = jest.spyOn(service, 'createForClient').mockResolvedValue(undefined);
    const mockUpdateResult: UpdateResult = {
      affected: 0,
      raw: [],
      generatedMaps: [],
    };

    metricRepository.increment.mockResolvedValue(mockUpdateResult);

    await service.incrementViews('client-1');

    expect(spy).toHaveBeenCalledWith('client-1', 1);
  });

  it('getDashboardData should return formatted dashboard metrics', async () => {
    const mockRawData: RawDashboardData = {
      totalClients: '5',
      totalValue: '10000',
      avgSalary: '2000',
    };

    const queryBuilder: Partial<SelectQueryBuilder<Client>> = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(mockRawData),
    };

    (clientRepository.createQueryBuilder as jest.Mock).mockReturnValue(queryBuilder);

    const mockMetrics: Partial<ClientMetric>[] = [
      {
        views: 10,
        client: {
          id: '1',
          name: 'Test',
          companyValue: 5000,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as Client,
      },
    ];

    metricRepository.find.mockResolvedValue(mockMetrics as ClientMetric[]);

    const result = await service.getDashboardData();

    expect(result).toEqual({
      totalClients: 5,
      totalCompanyValue: 10000,
      averageSalary: 2000,
      topViewedClients: [
        {
          id: '1',
          name: 'Test',
          views: 10,
          companyValue: 5000,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ],
    });
  });

  it('getGrowthMetrics should map raw query result', async () => {
    const mockRawGrowthData: RawGrowthData[] = [
      { month: '2025-01', count: '5', value: '10000' },
      { month: '2025-02', count: '3', value: '6000' },
    ];

    clientRepository.query.mockResolvedValue(mockRawGrowthData);

    const result = await service.getGrowthMetrics();

    expect(result).toEqual([
      { month: '2025-01', count: 5, totalCompanyValue: 10000 },
      { month: '2025-02', count: 3, totalCompanyValue: 6000 },
    ]);
  });
});
