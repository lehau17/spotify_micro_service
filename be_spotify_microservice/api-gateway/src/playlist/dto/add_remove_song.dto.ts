import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddRemovePlaylistDto {
  @ApiProperty({
    description: 'ID của bài hát',
    type: Number,
    example: 1, // Ví dụ về giá trị
  })
  @IsNumber()
  song_id: number;
}
