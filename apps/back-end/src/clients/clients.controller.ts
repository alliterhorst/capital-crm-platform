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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { ApiBaseAuthResponses } from '../common/decorators/api-base-responses.decorator';
import { PaginatedClientsResultDto } from './dto/paginated-clients.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ClientDetailDto } from './dto/client-detail.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { UpdateSelectionDto } from './dto/update-selection.dto';
import { UpdateResultDto } from './dto/update-result.dto';

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
    type: ClientResponseDto,
  })
  create(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
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
    type: ClientDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES_HELPER.CLIENTS.NOT_FOUND,
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ClientDetailDto> {
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
    type: ClientDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: MESSAGES_HELPER.CLIENTS.NOT_FOUND,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientDetailDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Patch()
  @ApiOperation({
    summary: MESSAGES_HELPER.SWAGGER.CLIENT_BULK_UPDATE_SUMMARY,
    operationId: 'updateAllSelections',
  })
  @ApiBaseAuthResponses({ notFound: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.CLIENTS.BULK_UPDATED,
    type: UpdateResultDto,
  })
  @HttpCode(HttpStatus.OK)
  updateAllSelections(@Body() updateSelectionDto: UpdateSelectionDto): Promise<UpdateResultDto> {
    return this.clientsService.updateAllSelections(updateSelectionDto);
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
