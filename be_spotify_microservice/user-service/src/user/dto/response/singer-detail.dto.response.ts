import { users } from '@prisma/client';

export type DetailSingerResponseDto = users & {
  songs: SongDto[];
  isFollow: boolean;
  statusFriendShip: string;
};

export type SongDto = {
  id: number;
  user_id: number;
  genre_id: number;
  song_name: string;
  viewer: number | null;
  duration: string | null;
  popular: boolean | null;
  description: string | null;
  song_image: string | null;
  public_date: Date | null;
  file_Path: string | null;
  discuss_quality: number | null;
  status: string;
  created_at: Date | null;
  updated_at: Date | null;
};
