export class CreateLikeSongDto {
  user: UserDto;
  song_id: number;
}

export type UserDto = {
  id: number;
  url: string;
  name: string;
};
