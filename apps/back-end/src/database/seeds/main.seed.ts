import AppDataSource from '../../config/typeorm.config';
import { seedAdmin } from './admin.seeder';

async function bootstrap(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    await seedAdmin(dataSource);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap();
