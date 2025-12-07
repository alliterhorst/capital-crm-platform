import { ApiProperty } from '@nestjs/swagger';

class ValidationErrorDetail {
  @ApiProperty({ description: 'Nome do campo que falhou', example: 'email' })
  field!: string;

  @ApiProperty({
    description: 'Regras de validação que falharam',
    example: ['O formato do e-mail é inválido.'],
  })
  errors!: string[];
}

export class BadRequestResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Erro de validação nos dados enviados.' })
  message!: string;

  @ApiProperty({ type: [ValidationErrorDetail] })
  errors!: ValidationErrorDetail[];

  @ApiProperty({ example: '2025-12-06T18:33:55.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/auth/login' })
  path!: string;
}

export class UnauthorizedResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'Credenciais inválidas ou token expirado.' })
  message!: string;

  @ApiProperty({ example: 'Unauthorized' })
  error!: string;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({ example: 500 })
  statusCode!: number;

  @ApiProperty({ example: 'Internal Server Error' })
  message!: string;
}

export class NotFoundResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'Recurso não encontrado.' })
  message!: string;

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}
