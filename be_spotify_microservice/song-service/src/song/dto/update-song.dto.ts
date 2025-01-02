import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDto } from './create-song.dto';

export class UpdateSongDto {
  id?: number;
  user_id?: number;
  song_name?: string;
  description?: string;
  song_image?: string;
  file_Path?: string;
}
