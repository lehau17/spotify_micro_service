import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSongDto {
  @ApiProperty({
    description: 'ID của thể loại',
    example: 1,
    type: Number,
  })
  @IsNumber()
  genre_id: number;

  @ApiProperty({
    description: 'Tên bài hát',
    example: 'Shape of You',
    type: String,
  })
  @IsString()
  song_name: string;

  @ApiProperty({
    description: 'Thời lượng của bài hát (định dạng hh:mm:ss)',
    example: '00:03:45',
    type: String,
  })
  @IsString()
  duration: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn về bài hát',
    example: 'A popular pop song',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'URL của ảnh đại diện bài hát',
    example: 'https://example.com/song-image.jpg',
    type: String,
  })
  @IsString()
  song_image: string;

  @ApiProperty({
    description: 'Đường dẫn hoặc URL của file bài hát (MP3)',
    example: '/uploads/song.mp3',
    type: String,
  })
  @IsString()
  file_Path: string;
}
