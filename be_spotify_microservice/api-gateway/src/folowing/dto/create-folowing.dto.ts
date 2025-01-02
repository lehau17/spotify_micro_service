import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowingDto {
  @ApiProperty({
    description: 'following_user_id',
    type: Number,
    default: 1,
  })
  following_user_id: number;
}
