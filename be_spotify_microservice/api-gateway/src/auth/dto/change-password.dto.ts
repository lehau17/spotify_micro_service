import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The new password for the user',
    example: 'P@ssw0rd123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;
}
