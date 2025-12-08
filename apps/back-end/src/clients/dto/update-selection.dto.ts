import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateSelectionDto {
  @ApiProperty({
    description:
      'Define o estado de seleção (true para selecionar todos, false para remover seleção de todos)',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isSelected!: boolean;
}
