import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateResultDto {
  @ApiProperty({
    description:
      'Resultado SQL bruto retornado pela consulta executada. O formato depende do driver do banco de dados.',
    example: {},
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw!: any;

  @ApiPropertyOptional({
    description:
      'Número de linhas/documentos afetados pela operação de atualização. Pode ser undefined em alguns drivers.',
    example: 42,
  })
  affected?: number;

  @ApiProperty({
    description:
      'Valores gerados pelo banco de dados (ex: chaves primárias ou timestamps) para as entidades atualizadas. Estrutura em formato de entidade.',
    example: [],
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generatedMaps!: Record<string, any>[];
}
