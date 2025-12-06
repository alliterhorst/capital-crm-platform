import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { envs } from '../../config/envs';
import { seedLogger } from './seed.logger';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = envs.ADMIN_EMAIL;
  const adminExists = await userRepository.findOne({ where: { email: adminEmail } });

  if (!adminExists) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(envs.ADMIN_PASSWORD, salt);

    const admin = userRepository.create({
      email: adminEmail,
      password: passwordHash,
    });

    await userRepository.save(admin);
    seedLogger.info('Seed: Admin user created successfully.');
  } else {
    seedLogger.info('Seed: Admin user already exists.');
  }
}
