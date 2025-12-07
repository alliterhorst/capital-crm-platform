import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { MESSAGES_HELPER } from '../constants/messages.helper';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página (início em 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MESSAGES_HELPER.VALIDATION.IS_INT })
  @Min(1, { message: MESSAGES_HELPER.VALIDATION.MIN_VALUE(1) })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MESSAGES_HELPER.VALIDATION.IS_INT })
  @Min(1, { message: MESSAGES_HELPER.VALIDATION.MIN_VALUE(1) })
  limit?: number = 10;
}
