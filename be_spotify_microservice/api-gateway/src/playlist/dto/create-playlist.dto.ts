import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SongDto {
  @ApiProperty({ description: 'Unique identifier of the song', example: 101 })
  id: number;

  @ApiPropertyOptional({
    description: 'Duration of the song',
    example: '3:45',
    nullable: true,
  })
  duration: string | null;

  @ApiPropertyOptional({
    description: 'Image associated with the song',
    example: 'https://example.com/song.jpg',
    nullable: true,
  })
  song_image: string | null;

  @ApiPropertyOptional({
    description: 'Path to the song file',
    example: 'https://example.com/audio.mp3',
    nullable: true,
  })
  file_Path: string | null;

  @ApiPropertyOptional({
    description: 'Quality score of the discussion about the song',
    example: 8,
    nullable: true,
  })
  discuss_quality: number | null;
}

export class CreatePlaylistDto {
  @ApiPropertyOptional({
    description: 'Path to the playlist image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  image_path?: string;

  @ApiProperty({
    description: 'The name of the playlist',
    example: 'My Favorite Songs',
  })
  @IsString()
  playlist_name: string;

  @ApiPropertyOptional({
    description: 'Description of the playlist',
    example: 'A collection of my all-time favorite tracks',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of songs in the playlist',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  song_ids: number[];
}
