import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUserService = {
  findByEmailForAuth: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockUser = {
  id: 'uuid-test-123',
  email: 'test@capital.com',
  name: 'Test User',
  password: 'hashedpassword',
};

const loginDto: LoginDto = {
  email: 'test@capital.com',
  password: 'validpassword',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an accessToken on successful login', async (): Promise<void> => {
      mockUserService.findByEmailForAuth.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mocked_access_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({ accessToken: 'mocked_access_token' });

      expect(usersService.findByEmailForAuth).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });

    it('should throw UnauthorizedException if user is not found', async (): Promise<void> => {
      mockUserService.findByEmailForAuth.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(MESSAGES_HELPER.AUTH.INVALID_CREDENTIALS),
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async (): Promise<void> => {
      mockUserService.findByEmailForAuth.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException(MESSAGES_HELPER.AUTH.INVALID_CREDENTIALS),
      );

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
