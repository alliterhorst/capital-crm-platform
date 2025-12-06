import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly metricsService: MetricsService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    this.logger.log(`Creating new client: ${createClientDto.name}`);

    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);

    await this.metricsService.createForClient(savedClient.id, 0);

    this.logger.log(`Client created successfully with ID: ${savedClient.id}`);
    return savedClient;
  }

  async findAll(): Promise<Client[]> {
    this.logger.log('Fetching all clients');
    return this.clientRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['metric'],
    });
  }

  async findOne(id: string): Promise<Client> {
    this.logger.debug(`Fetching client details: ${id}`);

    await this.metricsService.incrementViews(id);

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

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    this.logger.log(`Updating client: ${id}`);

    const client = await this.findOne(id);
    this.clientRepository.merge(client, updateClientDto);

    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Soft deleting client: ${id}`);

    const result = await this.clientRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(MESSAGES_HELPER.CLIENTS.NOT_FOUND);
    }
  }
}
