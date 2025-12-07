import { DataSource, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../clients/entities/client.entity';
import { ClientMetric } from '../../metrics/entities/client-metric.entity';
import { seedLogger } from './seed.logger';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

export class MockClientsSeed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const clientRepo = this.dataSource.getRepository(Client);
    const clientName = MESSAGES_HELPER.CLIENTS.CLIENT_MOCK;

    const existingCount = await clientRepo.count({
      where: {
        name: Like(`${clientName}%`),
      },
    });

    if (existingCount > 0) {
      seedLogger.info(MESSAGES_HELPER.CLIENTS.SEED_ALREADY_EXISTS);
      return;
    }

    seedLogger.info(MESSAGES_HELPER.CLIENTS.SEED_START);
    const metricRepo = this.dataSource.getRepository(ClientMetric);

    const today = new Date();
    const clientsToInsert: Client[] = [];
    const metricsToInsert: ClientMetric[] = [];

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);

      for (let i = 0; i < 5; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const creationDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), randomDay);

        const salary = Math.floor(Math.random() * 15000) + 2000;
        const companyValue = Math.floor(Math.random() * 2000000) + 100000;
        const clientId = uuidv4();
        const views = Math.floor(Math.random() * 200);

        const client = clientRepo.create({
          id: clientId,
          name: `${clientName} ${monthOffset}-${i}`,
          salary: salary,
          companyValue: companyValue,
          createdAt: creationDate,
          updatedAt: creationDate,
        });

        const metric = metricRepo.create({
          clientId: clientId,
          views: views,
          lastViewedAt: creationDate,
        });

        clientsToInsert.push(client);
        metricsToInsert.push(metric);
      }
    }

    await clientRepo.save(clientsToInsert);
    await metricRepo.save(metricsToInsert);

    seedLogger.info(MESSAGES_HELPER.CLIENTS.SEED_COMPLETE);
  }
}
