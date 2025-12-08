import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthenticatedUser, RequestWithUser } from '../interfaces/auth.interfaces';

const mockAuthService = {
  login: jest.fn(),
};

const mockLoginDto: LoginDto = {
  email: 'test@capital.com',
  password: 'validpassword',
};

const mockAuthResponse: AuthResponseDto = {
  accessToken: 'mocked.jwt.token',
};

const mockAuthenticatedUser: AuthenticatedUser = {
  id: 'user-uuid-123',
  email: 'test@capital.com',
  name: 'Test User',
};

const mockRequest: RequestWithUser = {
  user: mockAuthenticatedUser,
} as RequestWithUser;

const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', (): void => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return an AuthResponseDto', async (): Promise<void> => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user from the request object', (): void => {
      const result: AuthenticatedUser = controller.getProfile(mockRequest);

      expect(result).toEqual(mockAuthenticatedUser);
    });

    it('should be decorated with JwtAuthGuard', (): void => {
      const guards = Reflect.getMetadata('__guards__', controller.getProfile);

      expect(guards).toHaveLength(1);
    });
  });
});
