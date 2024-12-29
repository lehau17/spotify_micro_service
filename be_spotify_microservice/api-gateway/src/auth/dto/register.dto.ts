import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'name', type: 'string', required: true })
  @IsString()
  name: string;
  @ApiProperty({ description: 'account', type: 'string', required: true })
  @IsString()
  account: string;
  @ApiProperty({ description: 'password', type: 'string', required: true })
  @IsString()
  password: string;
}
