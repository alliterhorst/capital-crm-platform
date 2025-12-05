import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { envs } from '../../config/envs';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = envs.ADMIN_EMAIL;
  const adminExists = await userRepository.findOne({ where: { email: adminEmail } });

  if (!adminExists) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(envs.ADMIN_PASSWORD, salt);

    const admin = userRepository.create({
      name: 'Admin System',
      email: adminEmail,
      password: passwordHash,
    });

    await userRepository.save(admin);
    console.log('Seed: Admin user created successfully.');
  } else {
    console.log('Seed: Admin user already exists.');
  }
}
