import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmailForAuth(email: string): Promise<User | null> {
    this.logger.debug(`Searching user by email for auth: ${email}`);

    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });
  }

  async updateName(id: string, name: string): Promise<User> {
    this.logger.log(`Updating user name for ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User not found for update: ${id}`);
      throw new NotFoundException(MESSAGES_HELPER.AUTH.NOT_FOUND);
    }

    user.name = name;
    return this.userRepository.save(user);
  }
}
