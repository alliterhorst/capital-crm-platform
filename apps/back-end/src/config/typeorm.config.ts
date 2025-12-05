import { DataSource } from 'typeorm';
import { envs } from './envs';
import { ENTITIES_PATH, MIGRATIONS_PATH } from './paths';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_DATABASE,
  entities: [ENTITIES_PATH],
  migrations: [MIGRATIONS_PATH],
});

export default AppDataSource;
