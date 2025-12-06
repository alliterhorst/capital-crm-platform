import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
}
