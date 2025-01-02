export class CreateSongDto {
  user_id: number;
  genre_id: number;
  song_name: string;
  duration: string;

  description?: string;
  song_image: string;
  file_Path: string;
}
