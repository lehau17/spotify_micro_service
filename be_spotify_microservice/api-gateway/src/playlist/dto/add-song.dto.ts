import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddSongDto {
  @ApiProperty({
    description: 'Array of song IDs to add',
    type: [Number],
    example: [101, 102, 103],
  })
  @IsArray()
  song_ids: number[];
}
