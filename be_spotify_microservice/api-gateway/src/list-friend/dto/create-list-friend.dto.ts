import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateListFriendDto {
  @ApiProperty({
    description: 'ID of the friend to be added',
    example: 123,
  })
  @IsNumber()
  friend_id: number;
}
