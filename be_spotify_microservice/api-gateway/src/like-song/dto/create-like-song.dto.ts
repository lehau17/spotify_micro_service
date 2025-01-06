import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLikeSongDto {
  @ApiProperty({
    description: 'The ID of the song to be liked',
    example: 1, // Example value for documentation
  })
  @IsNumber()
  song_id: number;
}
