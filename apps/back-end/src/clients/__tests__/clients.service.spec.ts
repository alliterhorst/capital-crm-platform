// apps/back-end/src/clients/__tests__/clients.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from '../clients.service';
import { Client } from '../entities/client.entity';
import { MetricsService } from '../../metrics/metrics.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { UpdateSelectionDto } from '../dto/update-selection.dto';

type RepositoryMock = {
  create: jest.Mock;
  save: jest.Mock;
  findAndCount: jest.Mock;
  findOne: jest.Mock;
  merge: jest.Mock;
  update: jest.Mock;
  softDelete: jest.Mock;
};

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: RepositoryMock;
  let metricsService: { createForClient: jest.Mock; incrementViews: jest.Mock };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      merge: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    metricsService = {
      createForClient: jest.fn(),
      incrementViews: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: repository,
        },
        {
          provide: MetricsService,
          useValue: metricsService,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should persist client and create metrics', async () => {
    const dto: CreateClientDto = {
      name: 'John Doe',
      salary: 1000,
      companyValue: 2000,
      isSelected: false,
    };

    const created: Client = {
      id: 'uuid-1',
      name: dto.name,
      salary: dto.salary,
      companyValue: dto.companyValue,
      isSelected: dto.isSelected ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metric: null,
    } as unknown as Client;

    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(created);
    expect(metricsService.createForClient).toHaveBeenCalledWith(created.id, 0);
    expect(result).toBe(created);
  });

  it('findAll should return paginated clients without filter', async () => {
    const pagination: PaginationDto = { page: 2, limit: 5 };
    const clients: Client[] = [{ id: '1' } as Client, { id: '2' } as Client];
    repository.findAndCount.mockResolvedValue([clients, 12]);

    const result = await service.findAll(pagination);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      order: { createdAt: 'DESC' },
      take: 5,
      skip: 5,
    });

    expect(result.data).toEqual(clients);
    expect(result.meta).toEqual({
      total: 12,
      page: 2,
      lastPage: Math.ceil(12 / 5),
      limit: 5,
    });
  });

  it('findAll should apply selected filter when provided', async () => {
    const pagination: PaginationDto = { page: 1, limit: 10, selected: true };
    const clients: Client[] = [{ id: '1', isSelected: true } as Client];
    repository.findAndCount.mockResolvedValue([clients, 1]);

    const result = await service.findAll(pagination);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { isSelected: true },
      order: { createdAt: 'DESC' },
      take: 10,
      skip: 0,
    });

    expect(result.data).toEqual(clients);
    expect(result.meta.total).toBe(1);
  });

  it('findOne should increment views and return client detail', async () => {
    const id = 'client-1';
    const client: Client = {
      id,
      name: 'John',
      salary: 1000,
      companyValue: 2000,
      isSelected: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metric: { clientId: id, views: 1, lastViewedAt: new Date() },
    } as unknown as Client;

    repository.findOne.mockResolvedValue(client);

    const result = await service.findOne(id);

    expect(metricsService.incrementViews).toHaveBeenCalledWith(id);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['metric'],
    });
    expect(result).toBe(client);
  });

  it('findOne should throw NotFoundException when client does not exist', async () => {
    const id = 'missing';
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toBeInstanceOf(NotFoundException);
    expect(metricsService.incrementViews).toHaveBeenCalledWith(id);
  });

  it('update should merge and save client', async () => {
    const id = 'client-1';
    const existing: Client = {
      id,
      name: 'Old',
      salary: 1000,
      companyValue: 2000,
      isSelected: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metric: null,
    } as unknown as Client;

    const dto: UpdateClientDto = {
      name: 'New',
      salary: 1500,
    };

    repository.findOne.mockResolvedValue(existing);
    repository.merge.mockImplementation((entity: Client, partial: UpdateClientDto) =>
      Object.assign(entity, partial),
    );
    repository.save.mockImplementation(async (entity: Client) => entity);

    const result = await service.update(id, dto);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['metric'],
    });
    expect(repository.merge).toHaveBeenCalledWith(existing, dto);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id,
        name: dto.name,
        salary: dto.salary,
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id,
        name: dto.name,
        salary: dto.salary,
      }),
    );
  });

  it('update should throw NotFoundException when client does not exist', async () => {
    const id = 'missing';
    const dto: UpdateClientDto = { name: 'New' };
    repository.findOne.mockResolvedValue(null);

    await expect(service.update(id, dto)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateAllSelections should call repository.update with inverted where', async () => {
    const payload: UpdateSelectionDto = { isSelected: true };
    const updateResult = { affected: 5 };
    repository.update.mockResolvedValue(updateResult);

    const result = await service.updateAllSelections(payload);

    expect(repository.update).toHaveBeenCalledWith(
      { isSelected: !payload.isSelected },
      { isSelected: payload.isSelected },
    );
    expect(result).toBe(updateResult);
  });

  it('remove should soft delete client', async () => {
    const id = 'client-1';
    repository.softDelete.mockResolvedValue({ affected: 1 });

    await expect(service.remove(id)).resolves.toBeUndefined();
    expect(repository.softDelete).toHaveBeenCalledWith(id);
  });

  it('remove should throw NotFoundException when client does not exist', async () => {
    const id = 'missing';
    repository.softDelete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
