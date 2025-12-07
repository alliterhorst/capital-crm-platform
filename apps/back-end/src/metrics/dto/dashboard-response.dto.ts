import { ApiProperty } from '@nestjs/swagger';

class TopClientDto {
  @ApiProperty({ example: 'b7783b32-7251-4202-a018-f3ea91b9a871' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 150 })
  views!: number;

  @ApiProperty({ example: 50000.0 })
  companyValue!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Total de clientes ativos na base', example: 120 })
  totalClients!: number;

  @ApiProperty({ description: 'Soma do valor de mercado das empresas', example: 1500000.0 })
  totalCompanyValue!: number;

  @ApiProperty({ description: 'Média salarial dos clientes', example: 5400.5 })
  averageSalary!: number;

  @ApiProperty({ type: [TopClientDto], description: 'Top 5 clientes mais visualizados' })
  topViewedClients!: TopClientDto[];
}
