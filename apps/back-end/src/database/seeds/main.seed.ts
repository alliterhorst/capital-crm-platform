import AppDataSource from '../../config/typeorm.config';
import { seedAdmin } from './admin.seeder';
import { seedLogger } from './seed.logger';

async function bootstrap(): Promise<void> {
  seedLogger.info('Starting seed execution...');

  try {
    seedLogger.info('Connecting to database...');
    const dataSource = await AppDataSource.initialize();

    seedLogger.info('Running Admin Seeder...');
    await seedAdmin(dataSource);

    seedLogger.info('Seed execution completed successfully.');
    await dataSource.destroy();
  } catch (error) {
    seedLogger.error({ err: error }, 'Seed execution failed.');
    process.exit(1);
  }
}

bootstrap();
