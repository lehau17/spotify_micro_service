import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PagingDto } from 'src/common/paging/paging.dto';
import PlaylistServiceVer2 from './playlist.ver2.service';

@Controller()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @MessagePattern('createPlaylist')
  create(@Payload() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
  }

  @MessagePattern('findAllPlaylist')
  findAll(@Payload() paging: PagingDto & { user_id: number }) {
    return this.playlistService.findAll(paging);
  }

  @MessagePattern('addSongToPlaylist')
  addSong(
    @Payload() payload: { song_ids: number[]; id: number; user_id: number },
  ) {
    return this.playlistService.addSongToPlaylist(payload);
  }

  @MessagePattern('removeSongToPlaylist')
  removeSong(
    @Payload()
    payload: {
      song_id: number;
      playlist_id: number;
      user_id: number;
    },
  ) {
    return this.playlistService.removeASongOutPlayList(payload);
  }

  @MessagePattern('removePlaylist')
  remove(@Payload() { user_id, id }: { user_id: number; id: number }) {
    return this.playlistService.remove(id, user_id);
  }
}
