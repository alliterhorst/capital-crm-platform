import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

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
  @ApiProperty({ type: [ClientResponseDto] })
  data!: ClientResponseDto[];

  @ApiProperty({ type: PaginationMeta })
  meta!: PaginationMeta;
}
