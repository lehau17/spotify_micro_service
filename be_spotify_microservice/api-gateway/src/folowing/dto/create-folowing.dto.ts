import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateFollowingDto {
  @ApiProperty({
    description: 'following_user_id',
    type: Number,
    default: 1,
  })
  @IsInt()
  following_user_id: number;
}
