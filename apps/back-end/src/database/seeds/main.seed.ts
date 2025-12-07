import { MESSAGES_HELPER } from '../../common/constants/messages.helper';
import { envs } from '../../config/envs';
import AppDataSource from '../../config/typeorm.config';
import { seedAdmin } from './admin.seeder';
import { MockClientsSeed } from './mock-clients.seed';
import { seedLogger } from './seed.logger';

async function bootstrap(): Promise<void> {
  seedLogger.info('Starting seed execution...');

  try {
    seedLogger.info('Connecting to database...');
    const dataSource = await AppDataSource.initialize();

    seedLogger.info('Running Admin Seeder...');
    await seedAdmin(dataSource);

    if (envs.SEED_MOCK_DATA) {
      await new MockClientsSeed(dataSource).run();
    } else {
      seedLogger.info(MESSAGES_HELPER.CLIENTS.SEED_SKIPPED);
    }

    seedLogger.info('Seed execution completed successfully.');
    await dataSource.destroy();
  } catch (error) {
    seedLogger.error({ err: error }, 'Seed execution failed.');
    process.exit(1);
  }
}

bootstrap();
