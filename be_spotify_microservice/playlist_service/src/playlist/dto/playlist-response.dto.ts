import { playlists } from '@prisma/client';
import { SongDto } from './create-playlist.dto';

export type PlaylistResponse = {
  id: number;
  user_id: number;
  image_path: string;
  playlist_name: string;
  description: string;
  songs: SongDto[];
  created_at: Date;
  updated_at: Date;
};
