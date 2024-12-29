import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'id', type: 'string', required: true })
  @IsString()
  username: string;
  @ApiProperty({ description: 'id', type: 'string', required: true })
  @IsString()
  password: string;
}
