import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({ description: 'ID do cliente', example: '79ee2373-5d5d-4de7-9c48-e73bbd259fa1' })
  id!: string;

  @ApiProperty({ description: 'Nome do cliente', example: 'João da Silva' })
  name!: string;

  @ApiProperty({ description: 'Salário do cliente', example: 5000.0 })
  salary!: number;

  @ApiProperty({ description: 'Valor da empresa do cliente', example: 500123.59 })
  companyValue!: number;

  @ApiPropertyOptional({
    description: 'Define se o cliente está selecionado',
    example: false,
    default: false,
  })
  isSelected?: boolean;

  @ApiProperty({ description: 'Data de criação do cliente', example: '2023-10-01T12:34:56Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Data de atualização do cliente', example: '2023-10-02T12:34:56Z' })
  updatedAt!: Date;
}
