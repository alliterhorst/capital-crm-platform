import { ApiProperty } from '@nestjs/swagger';

export class MonthlyGrowthDto {
  @ApiProperty({ example: '2025-01' })
  month!: string;

  @ApiProperty({ example: 15 })
  count!: number;

  @ApiProperty({ example: 150000.0 })
  totalCompanyValue!: number;
}
