import { UserResponseDto } from "./auth.type";
import { SongDto } from "./song.response";

export type DetailSingerResponseDto = UserResponseDto & {
  songs: SongDto[];
  isFollow: boolean;
  statusFriendShip: string;
};
