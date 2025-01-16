import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeStatusDto {
  @ApiProperty({
    description: 'The new status to update',
    example: 'Enable',
  })
  @IsString()
  status: string;
}
