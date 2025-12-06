import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

export class CreateClientDto {
  @ApiProperty({ description: 'Nome do cliente', example: 'João da Silva' })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsString({ message: MESSAGES_HELPER.VALIDATION.IS_STRING })
  name!: string;

  @ApiProperty({ description: 'Salário do cliente', example: 5000.0 })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsNumber({}, { message: MESSAGES_HELPER.VALIDATION.IS_NUMBER })
  @Min(0, { message: MESSAGES_HELPER.VALIDATION.MIN_LENGTH(0) })
  salary!: number;

  @ApiProperty({ description: 'Valor da empresa do cliente', example: 1000000.5 })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsNumber({}, { message: MESSAGES_HELPER.VALIDATION.IS_NUMBER })
  @Min(0, { message: MESSAGES_HELPER.VALIDATION.MIN_LENGTH(0) })
  companyValue!: number;
}
