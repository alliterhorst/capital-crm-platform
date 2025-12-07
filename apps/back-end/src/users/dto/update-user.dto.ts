import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MESSAGES_HELPER } from '../../common/constants/messages.helper';

export class UpdateUserDto {
  @ApiProperty({ description: 'Novo nome do usuário', example: 'Admin System Updated' })
  @IsNotEmpty({ message: MESSAGES_HELPER.VALIDATION.IS_NOT_EMPTY })
  @IsString({ message: MESSAGES_HELPER.VALIDATION.IS_STRING })
  name!: string;
}
