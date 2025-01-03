import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRecentSongDto {
  @ApiProperty({
    description: 'ID của bài hát mà người dùng đã nghe',
    type: Number,
  })
  @IsNotEmpty()
  song_id: number;

  @ApiProperty({
    description: 'Thời gian mà người dùng nghe bài hát',
    type: String,
    example: '2025-01-01T12:00:00Z',
  })
  @IsNotEmpty()
  time: string;
}
