import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'admin@capital.com',
  })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsEmail({}, { message: MESSAGES_HELPER.VALIDATION.IS_EMAIL })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'admin123',
    minLength: 6,
  })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsString({ message: MESSAGES_HELPER.VALIDATION.IS_STRING })
  @MinLength(6, { message: MESSAGES_HELPER.VALIDATION.MIN_LENGTH(6) })
  password: string;
}
