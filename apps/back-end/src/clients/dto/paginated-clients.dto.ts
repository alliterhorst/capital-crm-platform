import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../entities/client.entity';

class PaginationMeta {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  lastPage!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}

export class PaginatedClientsResultDto {
  @ApiProperty({ type: [Client] })
  data!: Client[];

  @ApiProperty({ type: PaginationMeta })
  meta!: PaginationMeta;
}
