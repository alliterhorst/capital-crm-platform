import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { MetricsService } from '../metrics/metrics.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedClientsResultDto } from './dto/paginated-clients.dto';
import { ClientDetailDto } from './dto/client-detail.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { UpdateSelectionDto } from './dto/update-selection.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly metricsService: MetricsService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    this.logger.log(`Creating new client: ${createClientDto.name}`);

    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);

    await this.metricsService.createForClient(savedClient.id, 0);

    this.logger.log(`Client created successfully with ID: ${savedClient.id}`);
    return savedClient;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedClientsResultDto> {
    const { page = 1, limit = 10, selected } = paginationDto;
    const skip = (page - 1) * limit;

    this.logger.log(`Fetching clients page ${page} with limit ${limit}`);

    const where: FindOptionsWhere<Client> = {};

    if (selected !== undefined) {
      where.isSelected = selected;
    }

    const [data, total] = await this.clientRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    };
  }

  private async _findOneEntity(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['metric'],
    });

    if (!client) {
      this.logger.warn(`Client not found: ${id}`);
      throw new NotFoundException(MESSAGES_HELPER.CLIENTS.NOT_FOUND);
    }

    return client;
  }

  async findOne(id: string): Promise<ClientDetailDto> {
    this.logger.debug(`Fetching client details: ${id}`);

    await this.metricsService.incrementViews(id);

    const client = await this._findOneEntity(id);

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientDetailDto> {
    this.logger.log(`Updating client: ${id}`);

    const client = await this._findOneEntity(id);
    this.clientRepository.merge(client, updateClientDto);

    return await this.clientRepository.save(client);
  }

  async updateAllSelections({ isSelected }: UpdateSelectionDto): Promise<UpdateResultDto> {
    this.logger.log(`Updating selection for all clients to: ${isSelected}`);

    return await this.clientRepository.update({ isSelected: !isSelected }, { isSelected });
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Soft deleting client: ${id}`);

    const result = await this.clientRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(MESSAGES_HELPER.CLIENTS.NOT_FOUND);
    }
  }
}
