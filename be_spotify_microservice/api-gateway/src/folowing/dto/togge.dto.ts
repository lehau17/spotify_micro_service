import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, isNumber } from 'class-validator';

export class ToggerFollower {
  @ApiProperty({
    description: 'The ID of the user being followed',
    example: 123,
  })
  @IsNumber()
  following_user_id: number;
}
