import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { envs } from '../config/envs';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envs.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signOptions: { expiresIn: envs.JWT_EXPIRES_IN as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
