import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          } as Partial<jest.Mocked<Repository<User>>>,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmailForAuth should return user with selected fields', async () => {
    const user = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed-password',
      name: 'John Doe',
    } as unknown as User;

    repository.findOne.mockResolvedValue(user);

    const result = await service.findByEmailForAuth('test@test.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
      select: ['id', 'email', 'password', 'name'],
    });
    expect(result).toBe(user);
  });

  it('findByEmailForAuth should return null when not found', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await service.findByEmailForAuth('missing@test.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'missing@test.com' },
      select: ['id', 'email', 'password', 'name'],
    });
    expect(result).toBeNull();
  });

  it('updateName should update and save user', async () => {
    const existingUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed-password',
      name: 'Old Name',
    } as unknown as User;

    repository.findOne.mockResolvedValue(existingUser);
    repository.save.mockImplementation(async (userToSave: User) => userToSave);

    const result = await service.updateName('1', 'New Name');

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(repository.save).toHaveBeenCalledWith({
      ...existingUser,
      name: 'New Name',
    });
    expect(result.name).toBe('New Name');
  });

  it('updateName should throw NotFoundException when user does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    const promise = service.updateName('999', 'Name');

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow(MESSAGES_HELPER.AUTH.NOT_FOUND);
  });
});
