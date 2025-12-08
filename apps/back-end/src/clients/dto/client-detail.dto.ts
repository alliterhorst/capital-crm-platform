import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from './client-response.dto';

export class ClientMetricDto {
  @ApiProperty({
    description: 'ID do cliente associado à métrica',
    example: '79ee2373-5d5d-4de7-9c48-e73bbd259fa1',
  })
  clientId!: string;

  @ApiProperty({ description: 'Número de visualizações do cliente', example: 193 })
  views!: number;

  @ApiProperty({
    description: 'Data da última visualização do cliente',
    example: '2025-12-08T14:59:12.636Z',
  })
  lastViewedAt!: Date;
}

export class ClientDetailDto extends ClientResponseDto {
  @ApiProperty({
    type: ClientMetricDto,
  })
  metric?: ClientMetricDto;
}
