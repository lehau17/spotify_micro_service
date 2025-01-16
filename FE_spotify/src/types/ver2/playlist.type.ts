export type PlayListDto = {
  id: number;
  user_id: number;
  image_path: string;
  playlist_name: string;
  description: null;
  songs: never[];
  created_at: string;
  updated_at: string;
};

export type CreatePlaylistDto = {
  image_path: string;
  playlist_name: string;
  description: string;
  song_ids?: number[] | [];
};
