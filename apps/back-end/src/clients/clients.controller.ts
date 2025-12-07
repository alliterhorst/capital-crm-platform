import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { ApiBaseAuthResponses } from '../common/decorators/api-base-responses.decorator';
import { PaginatedClientsResultDto } from './dto/paginated-clients.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags(MESSAGES_HELPER.SWAGGER.CLIENTS_TAG)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_CREATE_SUMMARY,
    operationId: 'createClient',
  })
  @ApiBaseAuthResponses({ notFound: false })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: MESSAGES_HELPER.CLIENTS.CREATED,
  })
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_FIND_ALL_SUMMARY,
    operationId: 'listClients',
  })
  @ApiBaseAuthResponses({ notFound: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.CLIENTS.FETCH_ALL_SUCCESS,
    type: PaginatedClientsResultDto,
  })
  findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedClientsResultDto> {
    return this.clientsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_FIND_ONE_SUMMARY,
    operationId: 'getClientById',
  })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.CLIENTS.FETCH_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES_HELPER.CLIENTS.NOT_FOUND,
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_UPDATE_SUMMARY,
    operationId: 'updateClient',
  })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.CLIENTS.UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES_HELPER.CLIENTS.NOT_FOUND,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_DELETE_SUMMARY,
    operationId: 'deleteClient',
  })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: MESSAGES_HELPER.CLIENTS.DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES_HELPER.CLIENTS.NOT_FOUND,
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}
