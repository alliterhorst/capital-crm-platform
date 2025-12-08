import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthenticatedUser, JwtPayload } from '../interfaces/auth.interfaces';
import { Strategy } from 'passport-jwt';

const mockJwtPayload: JwtPayload = {
  sub: 'user-uuid-123',
  email: 'test@capital.com',
  name: 'Test User',
  iat: 1234567890,
  exp: 1234567890,
};

const expectedAuthenticatedUser: AuthenticatedUser = {
  id: 'user-uuid-123',
  email: 'test@capital.com',
  name: 'Test User',
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: Strategy,
          useValue: jest.fn(),
        },
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', (): void => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate the payload and return the AuthenticatedUser object', async (): Promise<void> => {
      const result: AuthenticatedUser = await strategy.validate(mockJwtPayload);

      expect(result).toEqual(expectedAuthenticatedUser);
      expect(result.id).toBe(mockJwtPayload.sub);
    });
  });
});
