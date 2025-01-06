export class CreatePlaylistDto {
  user_id: number;
  image_path?: string;
  playlist_name: string;
  description?: string;
  song_ids: number[];
}

export type SongDto = {
  id: number;
  duration: string | null;
  song_image: string | null;
  file_Path: string | null;
  discuss_quality: number | null;
};
