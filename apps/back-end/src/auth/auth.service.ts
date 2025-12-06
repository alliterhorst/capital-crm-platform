import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { JwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Attempting login for user: ${loginDto.email}`);

    const user = await this.usersService.findByEmailForAuth(loginDto.email);

    if (!user) {
      this.logger.warn(`Login failed: User not found - ${loginDto.email}`);
      throw new UnauthorizedException(MESSAGES_HELPER.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password - ${loginDto.email}`);
      throw new UnauthorizedException(MESSAGES_HELPER.AUTH.INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, name: user.name };
    const token = await this.jwtService.signAsync(payload);

    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      accessToken: token,
    };
  }
}
