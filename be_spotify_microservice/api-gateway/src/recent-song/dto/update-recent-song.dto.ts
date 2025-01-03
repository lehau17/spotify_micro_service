import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRecentSongDto } from './create-recent-song.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateRecentSongDto {
  @ApiProperty({
    description: 'Thời gian mà người dùng nghe bài hát',
    type: String,
    example: '2025-01-01T12:00:00Z',
  })
  @IsNotEmpty()
  time: string;
}
